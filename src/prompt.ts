import { text, confirm, select, multiselect } from "@clack/prompts";
import type { Option } from "@clack/prompts";

export const kCancel = Symbol.for("cancel");

export type PromptCommonOptions = {
  /**
   * Specify how to handle a cancelled prompt (e.g. by pressing Ctrl+C).
   *
   * Default strategy is `"default"`.
   *
   * - `"default"` - Resolve the promise with the `default` value or `initial` value.
   * - `"undefined`" - Resolve the promise with `undefined`.
   * - `"null"` - Resolve the promise with `null`.
   * - `"symbol"` - Resolve the promise with a symbol `Symbol.for("cancel")`.
   * - `"reject"`  - Reject the promise with an error.
   */
  cancel?: "reject" | "default" | "undefined" | "null" | "symbol";
};

export type TextPromptOptions = PromptCommonOptions & {
  /**
   * Specifies the prompt type as text.
   * @optional
   * @default "text"
   */
  type?: "text";

  /**
   * The default text value.
   * @optional
   */
  default?: string;

  /**
   * A placeholder text displayed in the prompt.
   * @optional
   */
  placeholder?: string;

  /**
   * The initial text value.
   * @optional
   */
  initial?: string;
};

export type ConfirmPromptOptions = PromptCommonOptions & {
  /**
   * Specifies the prompt type as confirm.
   */
  type: "confirm";

  /**
   * The initial value for the confirm prompt.
   * @optional
   */
  initial?: boolean;
};

export type SelectPromptOptions<Value> = PromptCommonOptions & {
  /**
   * Specifies the prompt type as select.
   */
  type: "select";

  /**
   * The initial value for the select prompt.
   * @optional
   */
  initial?: Value;

  /**
   * The options to select from.
   */
  options: (string | Option<Value>)[];
};

export type MultiSelectOptions<Value> = PromptCommonOptions & {
  /**
   * Specifies the prompt type as multiselect.
   */
  type: "multiselect";

  /**
   * The options to select from.
   */
  initial?: Value[];

  /**
   * The options to select from.
   */
  options: (string | Option<Value>)[];

  /**
   * Whether the prompt requires at least one selection.
   */
  required?: boolean;
};

/**
 * Defines a combined type for all prompt options.
 */
export type PromptOptions<Value = unknown> =
  | TextPromptOptions
  | ConfirmPromptOptions
  | SelectPromptOptions<Value>
  | MultiSelectOptions<Value>;

type inferPromptReturnType<Type, Value> = Type extends "text"
  ? string
  : Type extends "confirm"
    ? boolean
    : Type extends "select"
      ? Value
      : Type extends "multiselect"
        ? Value[]
        : unknown;

type inferPromptCancalReturnType<Type, Value, Cancel> = Cancel extends "reject"
  ? never
  : Cancel extends "default"
    ? inferPromptReturnType<Type, Value>
    : Cancel extends "undefined"
      ? undefined
      : Cancel extends "null"
        ? null
        : Cancel extends "symbol"
          ? typeof kCancel
          : inferPromptReturnType<Type, Value> /* default */;

/**
 * Asynchronously prompts the user for input based on specified options.
 * Supports text, confirm, select and multi-select prompts.
 *
 * @param {string} message - The message to display in the prompt.
 * @param {PromptOptions} [opts={}] - The prompt options. See {@link PromptOptions}.
 * @returns {Promise<inferPromptReturnType<T>>} - A promise that resolves with the user's response, the type of which is inferred from the options. See {@link inferPromptReturnType}.
 */
export async function prompt<
  Type = "text",
  Value = unknown,
  Cancel = "default",
>(
  message: string,
  opts: PromptOptions<Value> & { type?: Type; cancel?: Cancel } = {},
): Promise<
  | inferPromptReturnType<Type, Value>
  | inferPromptCancalReturnType<Type, Value, Cancel>
> {
  const handleCancel = (value: unknown) => {
    if (
      typeof value !== "symbol" ||
      value.toString() !== "Symbol(clack:cancel)"
    ) {
      return value;
    }

    switch (opts.cancel) {
      case "reject": {
        const error = new Error("Prompt cancelled.");
        error.name = "ConsolaPromptCancelledError";
        if (Error.captureStackTrace) {
          Error.captureStackTrace(error, prompt);
        }
        throw error;
      }
      case "undefined": {
        return undefined;
      }
      case "null": {
        return null;
      }
      case "symbol": {
        return kCancel;
      }
      default:
      case "default": {
        return (opts as TextPromptOptions).default ?? opts.initial;
      }
    }
  };

  if (!opts.type || opts.type === "text") {
    return (await text({
      message,
      defaultValue: (opts as TextPromptOptions).default,
      placeholder: (opts as TextPromptOptions).placeholder,
      initialValue: (opts as TextPromptOptions).initial,
    }).then(handleCancel)) as any;
  }

  if (opts.type === "confirm") {
    return (await confirm({
      message,
      initialValue: (opts as ConfirmPromptOptions).initial,
    }).then(handleCancel)) as any;
  }

  if (opts.type === "select") {
    return (await select({
      message,
      options: (opts as SelectPromptOptions<Value>).options.map((o) =>
        typeof o === "string" ? ({ value: o, label: o } as Option<Value>) : o,
      ),
      initialValue: (opts as SelectPromptOptions<Value>).initial,
    }).then(handleCancel)) as any;
  }

  if (opts.type === "multiselect") {
    return (await multiselect({
      message,
      options: (opts as MultiSelectOptions<Value>).options.map((o) =>
        typeof o === "string" ? ({ value: o, label: o } as Option<Value>) : o,
      ),
      required: (opts as MultiSelectOptions<Value>).required,
      initialValues: (opts as MultiSelectOptions<Value>).initial,
    }).then(handleCancel)) as any;
  }

  throw new Error(`Unknown prompt type: ${opts.type}`);
}
