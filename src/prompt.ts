import { text, confirm, select, multiselect } from "./utils/prompt";

type SelectOption = {
  label: string;
  value: string;
  hint?: string;
};

export type TextPromptOptions = {
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

export type ConfirmPromptOptions = {
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

export type SelectPromptOptions = {
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

export type MultiSelectOptions = {
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
): Promise<inferPromptReturnType<T>> {
  if (!opts.type || opts.type === "text") {
    return (await text({
      message,
      defaultValue: opts.default,
      placeholder: opts.placeholder,
      initialValue: opts.initial as string,
    })) as any;
  }

  if (opts.type === "confirm") {
    return (await confirm({
      message,
      initialValue: opts.initial,
    })) as any;
  }

  if (opts.type === "select") {
    return (await select({
      message,
      options: opts.options.map((o) =>
        typeof o === "string" ? { value: o, label: o } : o,
      ),
      initialValue: opts.initial,
    })) as any;
  }

  if (opts.type === "multiselect") {
    return (await multiselect({
      message,
      options: opts.options.map((o) =>
        typeof o === "string" ? { value: o, label: o } : o,
      ),
      required: opts.required,
      initialValues: opts.initial,
    })) as any;
  }

  throw new Error(`Unknown prompt type: ${opts.type}`);
}
