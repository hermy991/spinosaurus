export type ErrorConnection =
  | "ErrorConnectionNull"
  | "ErrorConnectionOptionsNotFound"
  | "ErrorTransactionNull"
  | "ErrorParamIsRequired";

export function error(req: { name?: ErrorConnection; message?: string }) {
  switch (req.name) {
    case "ErrorConnectionNull":
      return {
        message: "this.#connection is null, verify connection options",
        ...req,
      };
    case "ErrorConnectionOptionsNotFound":
      return {
        message: `options connection not found env, js, ts, json, yml, yaml, xml`,
        ...req,
      };
    case "ErrorTransactionNull":
      return {
        message: `transaction connection is null, verify transaction`,
        ...req,
      };
    case "ErrorParamIsRequired":
      return {
        message: `param is required`,
        ...req,
      };
  }
  return Error(req.message);
}
