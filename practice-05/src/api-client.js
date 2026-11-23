
export class ApiError extends Error {
  constructor(message, {
    kind,
    status = null,
    code = null,
    details = null,
    url = null,
    cause,
  } = {}) {
    super(message, cause === undefined ? undefined : { cause });
    this.name = "ApiError";
    this.kind = kind;
    this.status = status;
    this.code = code;
    this.details = details;
    this.url = url;
  }
}

// Создаёт URL и добавляет параметры запроса.
export function buildUrl(baseUrl, path, query = {}) {
  if (typeof baseUrl !== "string" || !baseUrl.trim()) {
    throw new TypeError("baseUrl должен быть непустой строкой.");
  }

  let base;

  try {
    base = new URL(baseUrl);
  } catch {
    throw new TypeError("baseUrl должен быть абсолютным URL.");
  }

  if (
    !["http:", "https:"].includes(base.protocol)
    || base.search
    || base.hash
    || base.username
    || base.password
  ) {
    throw new TypeError(
      "baseUrl должен быть HTTP(S)-адресом без query и hash.",
    );
  }

  if (
    typeof path !== "string"
    || !path.trim()
    || path.startsWith("http://")
    || path.startsWith("https://")
    || path.startsWith("//")
    || path.includes("?")
    || path.includes("#")
  ) {
    throw new TypeError("path должен быть непустым относительным путём.");
  }

  if (
    query === null
    || typeof query !== "object"
    || Array.isArray(query)
    || Object.getPrototypeOf(query) !== Object.prototype
  ) {
    throw new TypeError("query должен быть обычным объектом.");
  }

  const normalizedBase = baseUrl.replace(/\/+$/, "");
  const normalizedPath = path.replace(/^\/+|\/+$/g, "");

  if (!normalizedPath) {
    throw new TypeError("path должен содержать путь.");
  }

  const url = new URL(`${normalizedBase}/${normalizedPath}`);
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === "") {
      continue;
    }

    params.append(key, String(value));
  }

  url.search = params.toString();

  return url.toString();
}

// Создаёт HTTP-клиент.
export function createApiClient({baseUrl, fetchFn = globalThis.fetch, timeoutMs = 2000,} = {}) {
  if (typeof fetchFn !== "function") {
    throw new TypeError("fetchFn должен быть функцией.");
  }

  if (!Number.isSafeInteger(timeoutMs) || timeoutMs <= 0) {
    throw new TypeError("timeoutMs должен быть положительным числом.");
  }

  // Проверяем baseUrl при создании клиента.
  buildUrl(baseUrl, "check");

  async function requestJson(
    path,
    {
      query = {},
      signal,
      timeoutMs: requestTimeoutMs = timeoutMs,
    } = {},
  ) {
    if (!Number.isSafeInteger(requestTimeoutMs) || requestTimeoutMs <= 0) {
      throw new TypeError("timeoutMs должен быть положительным числом.");
    }

    const url = buildUrl(baseUrl, path, query);
    const controller = new AbortController();

    let timedOut = false;
    let externallyAborted = false;

    const onExternalAbort = () => {
      externallyAborted = true;
      controller.abort();
    };

    if (signal) {
      if (
        typeof signal.addEventListener !== "function"
        || typeof signal.removeEventListener !== "function"
      ) {
        throw new TypeError("Некорректный внешний signal.");
      }

      if (signal.aborted) {
        throw new ApiError("Запрос отменён.", {
          kind: "aborted",
          url,
        });
      }

      signal.addEventListener("abort", onExternalAbort, {
        once: true,
      });
    }

    const timer = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, requestTimeoutMs);

    try {
      let response;

      try {
        response = await fetchFn(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          signal: controller.signal,
        });
      } catch (error) {
        if (timedOut) {
          throw new ApiError("Время ожидания запроса истекло.", {
            kind: "timeout",
            url,
            cause: error,
          });
        }

        if (externallyAborted || signal?.aborted) {
          throw new ApiError("Запрос отменён.", {
            kind: "aborted",
            url,
            cause: error,
          });
        }

        throw new ApiError("Ошибка сети при выполнении запроса.", {
          kind: "network",
          url,
          cause: error,
        });
      }

      if (
        !response
        || typeof response !== "object"
        || typeof response.ok !== "boolean"
        || !Number.isFinite(response.status)
        || typeof response.json !== "function"
        || typeof response.headers?.get !== "function"
      ) {
        throw new ApiError("Некорректный объект HTTP-ответа.", {
          kind: "invalid-response",
          url,
        });
      }

      if (!response.ok) {
        let payload = null;

        try {
          payload = await response.json();
        } catch {
          // Сохраняем тип HTTP-ошибки,
          // даже если тело ответа не удалось разобрать.
        }

        const apiError = payload?.error;

        throw new ApiError(
          apiError?.message || `HTTP-ошибка ${response.status}.`,
          {
            kind: "http",
            status: response.status,
            code: apiError?.code ?? null,
            details: apiError?.details ?? null,
            url,
          },
        );
      }

      if (response.status === 204) {
        return null;
      }

      const contentType = response.headers.get("content-type") || "";

      if (
        !/^application\/(?:[a-z0-9.+-]+\+)?json(?:\s*;|$)/i.test(
          contentType,
        )
      ) {
        throw new ApiError(
          "Сервер вернул ответ не в формате JSON.",
          {
            kind: "invalid-response",
            url,
          },
        );
      }

      try {
        return await response.json();
      } catch (error) {
        throw new ApiError("Не удалось разобрать JSON-ответ.", {
          kind: "invalid-response",
          url,
          cause: error,
        });
      }
    } finally {
      clearTimeout(timer);

      if (signal) {
        signal.removeEventListener("abort", onExternalAbort);
      }
    }
  }

  return { requestJson };
}
