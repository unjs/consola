import { text, confirm, select, multiselect } from "./utils/prompt";

type SelectOption = {
  label: string;
  value: string;
  hint?: string;
};

const kCancel = Symbol.for("cancel");

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

export type SelectPromptOptions = PromptCommonOptions & {
  /**
   * Specifies the prompt type as select.
   */
  type: "select";

  /**
   * The initial value for the select prompt.
   * @optional
   */
  initial?: string;

  /**
   * The options to select from. See {@link SelectOption}.
   */
  options: (string | SelectOption)[];
};

export type MultiSelectOptions = PromptCommonOptions & {
  /**
   * Specifies the prompt type as multiselect.
   */
  type: "multiselect";

  /**
   * The options to select from. See {@link SelectOption}.
   */
  initial?: string[];

  /**
   * The options to select from. See {@link SelectOption}.
   */
  options: (string | SelectOption)[];

  /**
   * Whether the prompt requires at least one selection.
   */
  required?: boolean;
};

/**
 * Defines a combined type for all prompt options.
 */
export type PromptOptions =
  | TextPromptOptions
  | ConfirmPromptOptions
  | SelectPromptOptions
  | MultiSelectOptions;

type inferPromptReturnType<T extends PromptOptions> =
  T extends TextPromptOptions
    ? string
    : T extends ConfirmPromptOptions
      ? boolean
      : T extends SelectPromptOptions
        ? T["options"][number] extends SelectOption
          ? T["options"][number]["value"]
          : T["options"][number]
        : T extends MultiSelectOptions
          ? T["options"]
          : unknown;

type inferPromptCancalReturnType<T extends PromptOptions> = T extends {
  cancel: "reject";
}
  ? never
  : T extends { cancel: "default" }
    ? inferPromptReturnType<T>
    : T extends { cancel: "undefined" }
      ? undefined
      : T extends { cancel: "null" }
        ? null
        : T extends { cancel: "symbol" }
          ? typeof kCancel
          : inferPromptReturnType<T> /* default */;

/**
 * Asynchronously prompts the user for input based on specified options.
 * Supports text, confirm, select and multi-select prompts.
 *
 * @param {string} message - The message to display in the prompt.
 * @param {PromptOptions} [opts={}] - The prompt options. See {@link PromptOptions}.
 * @returns {Promise<inferPromptReturnType<T>>} - A promise that resolves with the user's response, the type of which is inferred from the options. See {@link inferPromptReturnType}.
 */
export async function prompt<
  _ = any,
  __ = any,
  T extends PromptOptions = TextPromptOptions,
>(
  message: string,
  opts: PromptOptions = {},
): Promise<inferPromptReturnType<T> | inferPromptCancalReturnType<T>> {
  const handleCancel = (value: unknown) => {
    if (
      typeof value !== "symbol" ||
      value.toString() !== "Symbol(clack:cancel)"
    ) {
      return value;
    }

    switch (opts.cancel) {
      case "reject":
        const error = new Error("Prompt cancelled.");
        error.name = "ConsolaPromptCancelledError";
        if (Error.captureStackTrace) {
          Error.captureStackTrace(error, prompt);
        }
        throw error;
      case "undefined":
        return undefined;
      case "null":
        return null;
      case "symbol":
        return kCancel;
      default:
      case "default":
        return (opts as TextPromptOptions).default ?? opts.initial;
    }
  };

  if (!opts.type || opts.type === "text") {
    return (await text({
      message,
      defaultValue: opts.default,
      placeholder: opts.placeholder,
      initialValue: opts.initial as string,
    }).then(handleCancel)) as any;
  }

  if (opts.type === "confirm") {
    return (await confirm({
      message,
      initialValue: opts.initial,
    }).then(handleCancel)) as any;
  }

  if (opts.type === "select") {
    return (await select({
      message,
      options: opts.options.map((o) =>
        typeof o === "string" ? { value: o, label: o } : o,
      ),
      initialValue: opts.initial,
    }).then(handleCancel)) as any;
  }

  if (opts.type === "multiselect") {
    return (await multiselect({
      message,
      options: opts.options.map((o) =>
        typeof o === "string" ? { value: o, label: o } : o,
      ),
      required: opts.required,
      initialValues: opts.initial,
    }).then(handleCancel)) as any;
  }

  throw new Error(`Unknown prompt type: ${opts.type}`);
}
