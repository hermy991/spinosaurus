export type ErrorConnection = "ErrorConnectionNull" | "ErrorConnectionNotFound";

export function error(req: { name?: ErrorConnection; message?: string }) {
  switch (req.name) {
    case "ErrorConnectionNull":
      return {
        message: "this.#connection is null, verifiy connection options",
        ...req,
      };
    case "ErrorConnectionNotFound":
      return {
        message:
          `options connection not found env, js, ts, json, yml, yaml, xml"`,
        ...req,
      };
  }
  return Error(req.message);
}
