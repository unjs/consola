/**
 * Based on https://github.com/natemoo-re/clack
 * Read LICENSE file for more information
 * https://github.com/natemoo-re/clack/blob/593f93d06c1a53c8424e9aaf0c1c63fbf6975527/packages/prompts/src/index.ts
 */

import {
  block,
  ConfirmPrompt,
  GroupMultiSelectPrompt,
  isCancel,
  MultiSelectPrompt,
  PasswordPrompt,
  SelectKeyPrompt,
  SelectPrompt,
  State,
  TextPrompt,
} from "@clack/core";

import isUnicodeSupported from "is-unicode-supported";

import { cursor, erase } from "sisteransi";

import { colors as color } from "./color";

const unicode = isUnicodeSupported();
/**
 * Checks if the environment supports Unicode and selects symbols accordingly.
 * @param {string} c - The preferred unicode symbol.
 * @param {string} fallback - The fallback symbol if Unicode is not supported.
 * @returns {string} The selected symbol based on Unicode support.
 */
const s = (c: string, fallback: string) => (unicode ? c : fallback);
const S_STEP_ACTIVE = s("❯", ">");
const S_STEP_CANCEL = s("■", "x");
const S_STEP_ERROR = s("▲", "x");
const S_STEP_SUBMIT = s("✔", "√");

const S_BAR_START = ""; // s("┌", "T");
const S_BAR = ""; // s("│", "|");
const S_BAR_END = ""; // s("└", "—");

const S_RADIO_ACTIVE = s("●", ">");
const S_RADIO_INACTIVE = s("○", " ");
const S_CHECKBOX_ACTIVE = s("◻", "[•]");
const S_CHECKBOX_SELECTED = s("◼", "[+]");
const S_CHECKBOX_INACTIVE = s("◻", "[ ]");
const S_PASSWORD_MASK = s("▪", "•");

const S_BAR_H = s("─", "-");
const S_CORNER_TOP_RIGHT = s("╮", "+");
const S_CONNECT_LEFT = s("├", "+");
const S_CORNER_BOTTOM_RIGHT = s("╯", "+");

const S_INFO = s("●", "•");
const S_SUCCESS = s("◆", "*");
const S_WARN = s("▲", "!");
const S_ERROR = s("■", "x");

const symbol = (state: State) => {
  switch (state) {
    case "initial":
    case "active": {
      return color.cyan(S_STEP_ACTIVE);
    }
    case "cancel": {
      return color.red(S_STEP_CANCEL);
    }
    case "error": {
      return color.yellow(S_STEP_ERROR);
    }
    case "submit": {
      return color.green(S_STEP_SUBMIT);
    }
  }
};

export interface TextOptions {
  /**
   * The primary message to display for the prompt.
   */
  message: string;

  /**
   * A placeholder string that is displayed in the input field when it is empty. It disappears when the user starts typing.
   * @optional
   */
  placeholder?: string;

  /**
   * The primary message to display for the prompt.
   * A default value for the input field.This value will be returned if the user does not enter a value.
   * @optional
   */
  defaultValue?: string;

  /**
   * An initial value that appears in the input field. Unlike `defaultValue`, it can be edited or removed by the user.
   * @optional
   */
  initialValue?: string;

  /**
   * A function to validate the input. If the input is not valid, this function should return a string message.
   * The prompt will continue until a valid value is entered or the prompt is aborted.
   * @param {string} value - The current value of the input field.
   * @returns {string | void} A string with an error message if validation fails or `void` if the input is valid.
   * optional
   */
  validate?: (value: string) => string | void;
}
/**
 * Provides text input functionality with customisable options.
 * @param {TextOptions} opts - Options to customise the text prompt. See {@link TextOptions}.
 * @returns {Promise<string | symbol>} A promise that resolves to the user input or a symbol for special cases.
 */
export const text = (opts: TextOptions) => {
  return new TextPrompt({
    validate: opts.validate,
    placeholder: opts.placeholder,
    defaultValue: opts.defaultValue,
    initialValue: opts.initialValue,
    render() {
      const title = `${color.gray(S_BAR)}\n${symbol(this.state)} ${
        opts.message
      }\n`;
      const placeholder = opts.placeholder
        ? color.inverse(opts.placeholder[0]) +
          color.dim(opts.placeholder.slice(1))
        : color.inverse(color.hidden("_"));
      const value = this.value ? this.valueWithCursor : placeholder;

      switch (this.state) {
        case "error": {
          return `${title.trim()}\n${color.yellow(
            S_BAR,
          )} ${value}\n${color.yellow(S_BAR_END)} ${color.yellow(
            this.error,
          )}\n`;
        }
        case "submit": {
          return `${title}${color.gray(S_BAR)} ${color.dim(
            this.value || opts.placeholder,
          )}`;
        }
        case "cancel": {
          return `${title}${color.gray(S_BAR)} ${color.strikethrough(
            color.dim(this.value ?? ""),
          )}${this.value?.trim() ? "\n" + color.gray(S_BAR) : ""}`;
        }
        default: {
          return `${title}${color.cyan(S_BAR)} ${value}\n${color.cyan(
            S_BAR_END,
          )}\n`;
        }
      }
    },
  }).prompt() as Promise<string | symbol>;
};

export interface PasswordOptions {
  /**
   * The message to be displayed above the input field.
   */
  message: string;

  /**
   * A character that masks the user's input, hiding the text they type.
   * @optional
   */
  mask?: string;

  /**
   * A function to validate the input. Returns an error message if the input fails validation.
   * @param {string} value - The current value of the input field.
   * @returns {string | void} An error message if the input fails validation, or `void` if the input is valid.
   * @optional
   */
  validate?: (value: string) => string | void;
}
/**
 * Provides password input functionality with customisable options, including input masking.
 * @param {PasswordOptions} opts - Options to customise the password prompt. See {@link PasswordOptions}.
 * @returns {Promise<string | symbol>} A promise that resolves to the user input or a symbol for special cases.
 */
export const password = (opts: PasswordOptions) => {
  return new PasswordPrompt({
    validate: opts.validate,
    mask: opts.mask ?? S_PASSWORD_MASK,
    render() {
      const title = `${color.gray(S_BAR)}\n${symbol(this.state)} ${
        opts.message
      }\n`;
      const value = this.valueWithCursor;
      const masked = this.masked;

      switch (this.state) {
        case "error": {
          return `${title.trim()}\n${color.yellow(
            S_BAR,
          )} ${masked}\n${color.yellow(S_BAR_END)} ${color.yellow(
            this.error,
          )}\n`;
        }
        case "submit": {
          return `${title}${color.gray(S_BAR)} ${color.dim(masked)}`;
        }
        case "cancel": {
          return `${title}${color.gray(S_BAR)} ${color.strikethrough(
            color.dim(masked ?? ""),
          )}${masked ? "\n" + color.gray(S_BAR) : ""}`;
        }
        default: {
          return `${title}${color.cyan(S_BAR)} ${value}\n${color.cyan(
            S_BAR_END,
          )}\n`;
        }
      }
    },
  }).prompt() as Promise<string | symbol>;
};

export interface ConfirmOptions {
  /**
   * The primary message to display for the prompt.
   */
  message: string;

  /**
   * The text to display for the active/affirmative choice.
   * @optional
   */
  active?: string;

  /**
   * Text to display for the inactive/negative choice.
   * @optional
   */
  inactive?: string;

  /**
   * The initial selection value.
   * @optional
   */
  initialValue?: boolean;
}
/**
 * Provides a confirmation prompt with customisable options.
 * @param {ConfirmOptions} opts - Options to customise the confirmation prompt. See {@link ConfirmOptions}.
 * @returns {Promise<boolean | symbol>} A promise that resolves to the user's choice, or a symbol for special cases.
 */
export const confirm = (opts: ConfirmOptions) => {
  const active = opts.active ?? "Yes";
  const inactive = opts.inactive ?? "No";
  return new ConfirmPrompt({
    active,
    inactive,
    initialValue: opts.initialValue ?? true,
    render() {
      const title = `${color.gray(S_BAR)}\n${symbol(this.state)} ${
        opts.message
      }\n`;
      const value = this.value ? active : inactive;

      switch (this.state) {
        case "submit": {
          return `${title}${color.gray(S_BAR)} ${color.dim(value)}`;
        }
        case "cancel": {
          return `${title}${color.gray(S_BAR)} ${color.strikethrough(
            color.dim(value),
          )}\n${color.gray(S_BAR)}`;
        }
        default: {
          return `${title}${color.cyan(S_BAR)} ${
            this.value
              ? `${color.green(S_RADIO_ACTIVE)} ${active}`
              : `${color.dim(S_RADIO_INACTIVE)} ${color.dim(active)}`
          } ${color.dim("/")} ${
            this.value
              ? `${color.dim(S_RADIO_INACTIVE)} ${color.dim(inactive)}`
              : `${color.green(S_RADIO_ACTIVE)} ${inactive}`
          }\n${color.cyan(S_BAR_END)}\n`;
        }
      }
    },
  }).prompt() as Promise<boolean | symbol>;
};

/**
 * A generic type for option values in a select prompt, supporting both primitive and complex types.
 */
type Primitive = Readonly<string | boolean | number>;

/**
 * Defines the structure of an option in a select prompt.
 */
type Option<Value> = Value extends Primitive
  ? { value: Value; label?: string; hint?: string } // For primitive types
  : { value: Value; label: string; hint?: string }; // For complex types

/**
 * Options for configuring the select prompt.
 * @template Options - An array of option objects. See {@link Option}.
 * @template Value - The type of option value. See {@link Option}.
 */
export interface SelectOptions<Options extends Option<Value>[], Value> {
  /**
   * The primary message to display at the prompt.
   */
  message: string;

  /**
   * The list of options from which the user can choose. See {@link Option}.
   */
  options: Options;

  /**
   * The initial value selected in the prompt. See {@link Value}.
   * @optional
   */
  initialValue?: Value;
}
/**
 * Provides a select prompt functionality where the user can choose from a list of options.
 * @param {SelectOptions<Options, Value>} opts - Options to customise the select prompt. See {@link SelectOptions}.
 * @returns {Promise<Value | Symbol>} A promise that resolves to the selected value or a symbol for special cases. See {@link Value}.
 */
export const select = <Options extends Option<Value>[], Value>(
  opts: SelectOptions<Options, Value>,
) => {
  const opt = (
    option: Option<Value>,
    state: "inactive" | "active" | "selected" | "cancelled",
  ) => {
    const label = option.label ?? String(option.value);
    switch (state) {
      case "active": {
        return `${color.green(S_RADIO_ACTIVE)} ${label} ${
          option.hint ? color.dim(`(${option.hint})`) : ""
        }`;
      }
      case "selected": {
        return `${color.dim(label)}`;
      }
      case "cancelled": {
        return `${color.strikethrough(color.dim(label))}`;
      }
      // No default
    }
    return `${color.dim(S_RADIO_INACTIVE)} ${color.dim(label)}`;
  };

  return new SelectPrompt({
    options: opts.options,
    initialValue: opts.initialValue,
    render() {
      const title = `${color.gray(S_BAR)}\n${symbol(this.state)} ${
        opts.message
      }\n`;

      switch (this.state) {
        case "submit": {
          return `${title}${color.gray(S_BAR)} ${opt(
            this.options[this.cursor],
            "selected",
          )}`;
        }
        case "cancel": {
          return `${title}${color.gray(S_BAR)} ${opt(
            this.options[this.cursor],
            "cancelled",
          )}\n${color.gray(S_BAR)}`;
        }
        default: {
          return `${title}${color.cyan(S_BAR)} ${this.options
            .map((option, i) =>
              opt(option, i === this.cursor ? "active" : "inactive"),
            )
            .join(`\n${color.cyan(S_BAR)}  `)}\n${color.cyan(S_BAR_END)}\n`;
        }
      }
    },
  }).prompt() as Promise<Value | symbol>;
};

/**
 * Provides a prompt that allows the user to select an option by pressing a key.
 * This is useful for scenarios where each option is associated with a specific key.
 * @param {SelectOptions<Options, Value>} opts - Configuration options for the select key prompt. See {@link SelectOptions}.
 * @returns {Promise<Value | Symbol>} A promise that resolves to the value of the selected option, or a symbol for special cases such as abort. See {@link Value}.
 */
export const selectKey = <
  Options extends Option<Value>[],
  Value extends string,
>(
  opts: SelectOptions<Options, Value>,
) => {
  const opt = (
    option: Option<Value>,
    state: "inactive" | "active" | "selected" | "cancelled" = "inactive",
  ) => {
    const label = option.label ?? String(option.value);
    switch (state) {
      case "selected": {
        return `${color.dim(label)}`;
      }
      case "cancelled": {
        return `${color.strikethrough(color.dim(label))}`;
      }
      case "active": {
        return `${color.bgCyan(color.gray(` ${option.value} `))} ${label} ${
          option.hint ? color.dim(`(${option.hint})`) : ""
        }`;
      }
      // No default
    }
    return `${color.gray(
      color.bgWhite(color.inverse(` ${option.value} `)),
    )} ${label} ${option.hint ? color.dim(`(${option.hint})`) : ""}`;
  };

  return new SelectKeyPrompt({
    options: opts.options,
    initialValue: opts.initialValue,
    render() {
      const title = `${color.gray(S_BAR)}\n${symbol(this.state)} ${
        opts.message
      }\n`;

      switch (this.state) {
        case "submit": {
          return `${title}${color.gray(S_BAR)} ${opt(
            this.options.find((opt) => opt.value === this.value)!,
            "selected",
          )}`;
        }
        case "cancel": {
          return `${title}${color.gray(S_BAR)} ${opt(
            this.options[0],
            "cancelled",
          )}\n${color.gray(S_BAR)}`;
        }
        default: {
          return `${title}${color.cyan(S_BAR)} ${this.options
            .map((option, i) =>
              opt(option, i === this.cursor ? "active" : "inactive"),
            )
            .join(`\n${color.cyan(S_BAR)}  `)}\n${color.cyan(S_BAR_END)}\n`;
        }
      }
    },
  }).prompt() as Promise<Value | symbol>;
};

export interface MultiSelectOptions<Options extends Option<Value>[], Value> {
  /**
   * The primary message to be displayed above the multi-select list.
   */
  message: string;

  /**
   * The list of options from which users can select multiple items. See {@link Option}.
   */
  options: Options;

  /**
   * An array of values representing the options initially selected in the prompt. See {@link Value}.
   * @optional
   */
  initialValues?: Value[];

  /**
   * Specifies whether at least one selection is required before submitting.
   * @optional
   */
  required?: boolean;

  /**
   * The value of the option on which the cursor is initially placed when the command prompt opens. See {@link Value}.
   * @optional
   */
  cursorAt?: Value;
}
/**
 * Provides multi-select prompt functionality where the user can select multiple options from a list.
 * @param {MultiSelectOptions<Options, Value>} opts - Options to customise the multi-select prompt. See {@link MultiSelectOptions}.
 * @returns {Promise<Value[] | Symbol>} A promise that resolves to an array of selected values, or a symbol for special cases.
 */
export const multiselect = <Options extends Option<Value>[], Value>(
  opts: MultiSelectOptions<Options, Value>,
) => {
  const opt = (
    option: Option<Value>,
    state:
      | "inactive"
      | "active"
      | "selected"
      | "active-selected"
      | "submitted"
      | "cancelled",
  ) => {
    const label = option.label ?? String(option.value);
    switch (state) {
      case "active": {
        return `${color.cyan(S_CHECKBOX_ACTIVE)} ${label} ${
          option.hint ? color.dim(`(${option.hint})`) : ""
        }`;
      }
      case "selected": {
        return `${color.green(S_CHECKBOX_SELECTED)} ${color.dim(label)}`;
      }
      case "cancelled": {
        return `${color.strikethrough(color.dim(label))}`;
      }
      case "active-selected": {
        return `${color.green(S_CHECKBOX_SELECTED)} ${label} ${
          option.hint ? color.dim(`(${option.hint})`) : ""
        }`;
      }
      case "submitted": {
        return `${color.dim(label)}`;
      }
      // No default
    }
    return `${color.dim(S_CHECKBOX_INACTIVE)} ${color.dim(label)}`;
  };

  return new MultiSelectPrompt({
    options: opts.options,
    initialValues: opts.initialValues,
    required: opts.required ?? true,
    cursorAt: opts.cursorAt,
    validate(selected: Value[]) {
      if (this.required && selected.length === 0) {
        return `Please select at least one option.\n${color.reset(
          color.dim(
            `Press ${color.gray(
              color.bgWhite(color.inverse(" space ")),
            )} to select, ${color.gray(
              color.bgWhite(color.inverse(" enter ")),
            )} to submit`,
          ),
        )}`;
      }
    },
    render() {
      const title = `${color.gray(S_BAR)}\n${symbol(this.state)} ${
        opts.message
      }\n`;

      switch (this.state) {
        case "submit": {
          return `${title}${color.gray(S_BAR)} ${
            this.options
              .filter(({ value }) => this.value.includes(value))
              .map((option) => opt(option, "submitted"))
              .join(color.dim(", ")) || color.dim("none")
          }`;
        }
        case "cancel": {
          const label = this.options
            .filter(({ value }) => this.value.includes(value))
            .map((option) => opt(option, "cancelled"))
            .join(color.dim(", "));
          return `${title}${color.gray(S_BAR)} ${
            label.trim() ? `${label}\n${color.gray(S_BAR)}` : ""
          }`;
        }
        case "error": {
          const footer = this.error
            .split("\n")
            .map((ln, i) =>
              i === 0
                ? `${color.yellow(S_BAR_END)} ${color.yellow(ln)}`
                : `   ${ln}`,
            )
            .join("\n");
          return (
            title +
            color.yellow(S_BAR) +
            "  " +
            this.options
              .map((option, i) => {
                const selected = this.value.includes(option.value);
                const active = i === this.cursor;
                if (active && selected) {
                  return opt(option, "active-selected");
                }
                if (selected) {
                  return opt(option, "selected");
                }
                return opt(option, active ? "active" : "inactive");
              })
              .join(`\n${color.yellow(S_BAR)}  `) +
            "\n" +
            footer +
            "\n"
          );
        }
        default: {
          return `${title}${color.cyan(S_BAR)} ${this.options
            .map((option, i) => {
              const selected = this.value.includes(option.value);
              const active = i === this.cursor;
              if (active && selected) {
                return opt(option, "active-selected");
              }
              if (selected) {
                return opt(option, "selected");
              }
              return opt(option, active ? "active" : "inactive");
            })
            .join(`\n${color.cyan(S_BAR)}  `)}\n${color.cyan(S_BAR_END)}\n`;
        }
      }
    },
  }).prompt() as Promise<Value[] | symbol>;
};

export interface GroupMultiSelectOptions<
  Options extends Option<Value>[],
  Value,
> {
  /**
   * The primary message to be displayed above the group multi-select list.
   */
  message: string;

  /**
   * An object containing groups of options. Each key represents a group name,
   * and the associated value is an array of options within that group. See {@link Option}.
   */
  options: Record<string, Options>;

  /**
   * An array of values representing the initially selected options across all groups. See {@link Value}.
   * @optional
   */
  initialValues?: Value[];

  /**
   * Specifies whether at least one selection is required before submission is allowed.
   * @optional
   */
  required?: boolean;

  /**
   * The value of the option on which the cursor will initially appear when the command prompt opens. See {@link Value}.
   * @optional
   */
  cursorAt?: Value;
}
export const groupMultiselect = <Options extends Option<Value>[], Value>(
  opts: GroupMultiSelectOptions<Options, Value>,
) => {
  const opt = (
    option: Option<Value>,
    state:
      | "inactive"
      | "active"
      | "selected"
      | "active-selected"
      | "group-active"
      | "group-active-selected"
      | "submitted"
      | "cancelled",
    options: Option<Value>[] = [],
  ) => {
    const label = option.label ?? String(option.value);
    const isItem = typeof (option as any).group === "string";
    const next =
      isItem && (options[options.indexOf(option) + 1] ?? { group: true });
    const isLast = isItem && (next as any).group === true;
    const prefix = isItem ? `${isLast ? S_BAR_END : S_BAR} ` : "";

    switch (state) {
      case "active": {
        return `${color.dim(prefix)}${color.cyan(S_CHECKBOX_ACTIVE)} ${label} ${
          option.hint ? color.dim(`(${option.hint})`) : ""
        }`;
      }
      case "group-active": {
        return `${prefix}${color.cyan(S_CHECKBOX_ACTIVE)} ${color.dim(label)}`;
      }
      case "group-active-selected": {
        return `${prefix}${color.green(S_CHECKBOX_SELECTED)} ${color.dim(
          label,
        )}`;
      }
      case "selected": {
        return `${color.dim(prefix)}${color.green(
          S_CHECKBOX_SELECTED,
        )} ${color.dim(label)}`;
      }
      case "cancelled": {
        return `${color.strikethrough(color.dim(label))}`;
      }
      case "active-selected": {
        return `${color.dim(prefix)}${color.green(
          S_CHECKBOX_SELECTED,
        )} ${label} ${option.hint ? color.dim(`(${option.hint})`) : ""}`;
      }
      case "submitted": {
        return `${color.dim(label)}`;
      }
      // No default
    }
    return `${color.dim(prefix)}${color.dim(S_CHECKBOX_INACTIVE)} ${color.dim(
      label,
    )}`;
  };

  return new GroupMultiSelectPrompt({
    options: opts.options,
    initialValues: opts.initialValues,
    required: opts.required ?? true,
    cursorAt: opts.cursorAt,
    validate(selected: Value[]) {
      if (this.required && selected.length === 0) {
        return `Please select at least one option.\n${color.reset(
          color.dim(
            `Press ${color.gray(
              color.bgWhite(color.inverse(" space ")),
            )} to select, ${color.gray(
              color.bgWhite(color.inverse(" enter ")),
            )} to submit`,
          ),
        )}`;
      }
    },
    render() {
      const title = `${color.gray(S_BAR)}\n${symbol(this.state)} ${
        opts.message
      }\n`;

      switch (this.state) {
        case "submit": {
          return `${title}${color.gray(S_BAR)} ${this.options
            .filter(({ value }) => this.value.includes(value))
            .map((option) => opt(option, "submitted"))
            .join(color.dim(", "))}`;
        }
        case "cancel": {
          const label = this.options
            .filter(({ value }) => this.value.includes(value))
            .map((option) => opt(option, "cancelled"))
            .join(color.dim(", "));
          return `${title}${color.gray(S_BAR)} ${
            label.trim() ? `${label}\n${color.gray(S_BAR)}` : ""
          }`;
        }
        case "error": {
          const footer = this.error
            .split("\n")
            .map((ln, i) =>
              i === 0
                ? `${color.yellow(S_BAR_END)} ${color.yellow(ln)}`
                : `   ${ln}`,
            )
            .join("\n");
          return `${title}${color.yellow(S_BAR)} ${this.options
            .map((option, i, options) => {
              const selected =
                this.value.includes(option.value) ||
                (option.group === true &&
                  this.isGroupSelected(`${option.value}`));
              const active = i === this.cursor;
              const groupActive =
                !active &&
                typeof option.group === "string" &&
                this.options[this.cursor].value === option.group;
              if (groupActive) {
                return opt(
                  option,
                  selected ? "group-active-selected" : "group-active",
                  options,
                );
              }
              if (active && selected) {
                return opt(option, "active-selected", options);
              }
              if (selected) {
                return opt(option, "selected", options);
              }
              return opt(option, active ? "active" : "inactive", options);
            })
            .join(`\n${color.yellow(S_BAR)}  `)}\n${footer}\n`;
        }
        default: {
          return `${title}${color.cyan(S_BAR)} ${this.options
            .map((option, i, options) => {
              const selected =
                this.value.includes(option.value) ||
                (option.group === true &&
                  this.isGroupSelected(`${option.value}`));
              const active = i === this.cursor;
              const groupActive =
                !active &&
                typeof option.group === "string" &&
                this.options[this.cursor].value === option.group;
              if (groupActive) {
                return opt(
                  option,
                  selected ? "group-active-selected" : "group-active",
                  options,
                );
              }
              if (active && selected) {
                return opt(option, "active-selected", options);
              }
              if (selected) {
                return opt(option, "selected", options);
              }
              return opt(option, active ? "active" : "inactive", options);
            })
            .join(`\n${color.cyan(S_BAR)}  `)}\n${color.cyan(S_BAR_END)}\n`;
        }
      }
    },
  }).prompt() as Promise<Value[] | symbol>;
};

const strip = (str: string) => str.replace(ansiRegex(), "");

/**
 * Displays a formatted note in the console, with an optional title. The note is visually distinguished
 * from regular console output with ANSI colour codes and styles to make it stand out. The function calculates
 * the length of the longest line to ensure the note is properly aligned and framed.
 *
 * @param {string} [message=""] - The main text of the note. Supports multiline strings.
 * @param {string} [title=""] - An optional title for the note. If provided, it'll be displayed above the message.
 */
export const note = (message = "", title = "") => {
  const lines = `\n${message}\n`.split("\n");
  const len =
    Math.max(
      // eslint-disable-next-line unicorn/no-array-reduce
      lines.reduce((sum, ln) => {
        ln = strip(ln);
        return ln.length > sum ? ln.length : sum;
      }, 0),
      strip(title).length,
    ) + 2;
  const msg = lines
    .map(
      (ln) =>
        `${color.gray(S_BAR)} ${color.dim(ln)}${" ".repeat(
          len - strip(ln).length,
        )}${color.gray(S_BAR)}`,
    )
    .join("\n");
  process.stdout.write(
    `${color.gray(S_BAR)}\n${color.green(S_STEP_SUBMIT)} ${color.reset(
      title,
    )} ${color.gray(
      S_BAR_H.repeat(Math.max(len - title.length - 1, 1)) + S_CORNER_TOP_RIGHT,
    )}\n${msg}\n${color.gray(
      S_CONNECT_LEFT + S_BAR_H.repeat(len + 2) + S_CORNER_BOTTOM_RIGHT,
    )}\n`,
  );
};

/**
 * Prints an abort message to the console. This is typically used to indicate
 * that a process or operation has been cancelled. The message is coloured for
 * for emphasis and visual differentiation.
 *
 * @param {string} [message=""] - The cancellation message to display. This parameter
 * is optional; if omitted, the default styling will be used without a specific message.
 */
export const cancel = (message = "") => {
  process.stdout.write(`${color.gray(S_BAR_END)} ${color.red(message)}\n\n`);
};

/**
 * Prints an introductory message to the console. This function is used to
 * Display a title or short message at the beginning of a script or application.
 * framed by a specified bar character for visual distinction.
 *
 * @param {string} [title=""] - The title or message to display. This parameter is optional; if omitted, only the framing bar will be printed.
 */
export const intro = (title = "") => {
  process.stdout.write(`${color.gray(S_BAR_START)} ${title}\n`);
};

/**
 * Prints a closing message to the console. Similar to the `intro` function,
 * `outro' is designed to indicate the end of a script or application execution
 * with a framed message for clear visual separation from the rest of the console output.
 *
 * @param {string} [message=""] - The final message to display. This parameter is optional; if omitted, only the border will be printed.
 */
export const outro = (message = "") => {
  process.stdout.write(
    `${color.gray(S_BAR)}\n${color.gray(S_BAR_END)} ${message}\n\n`,
  );
};

export type LogMessageOptions = {
  /**
   * A custom icon to be placed in front of the log message. This allows visual differentiation
   * log messages based on their importance or category (e.g. info, error).
   * @optional
   */
  symbol?: string;
};
/**
 * Logs a message to the console, with support for different types of messages (info, success, warning, error).
 */
export const log = {
  /**
   * Logs an message, prefixed with a gray bar.
   * @param {string} message - The message to log.
   * @param {LogMessageOptions} [opts] - Optional settings for the log message. See {@link LogMessageOptions}.
   */
  message: (
    message = "",
    { symbol = color.gray(S_BAR) }: LogMessageOptions = {},
  ) => {
    const parts = [`${color.gray(S_BAR)}`];
    if (message) {
      const [firstLine, ...lines] = message.split("\n");
      parts.push(
        `${symbol} ${firstLine}`,
        ...lines.map((ln) => `${color.gray(S_BAR)} ${ln}`),
      );
    }
    process.stdout.write(`${parts.join("\n")}\n`);
  },
  /**
   * Logs an information message, prefixed with a blue info icon.
   * @param {string} message - The message to log.
   */
  info: (message: string) => {
    log.message(message, { symbol: color.blue(S_INFO) });
  },
  /**
   * Logs a success message, preceded by a green check symbol.
   * @param {string} message - The message to log.
   */
  success: (message: string) => {
    log.message(message, { symbol: color.green(S_SUCCESS) });
  },
  /**
   * Logs a step message, typically used to indicate a step in a process, preceded by a green submit symbol.
   * @param {string} message - The message to log.
   */
  step: (message: string) => {
    log.message(message, { symbol: color.green(S_STEP_SUBMIT) });
  },
  /**
   * Logs a warning message, preceded by a yellow warning icon.
   * @param {string} message - The message to log.
   */
  warn: (message: string) => {
    log.message(message, { symbol: color.yellow(S_WARN) });
  },
  /** alias for `log.warn()`. See {@link log.warn}. */
  warning: (message: string) => {
    log.warn(message);
  },
  /**
   * Logs an error message, preceded by a red error icon.
   * @param {string} message - The message to log.
   */
  error: (message: string) => {
    log.message(message, { symbol: color.red(S_ERROR) });
  },
};

const frames = unicode ? ["◒", "◐", "◓", "◑"] : ["•", "o", "O", "0"];

/**
 * Displays an animated spinner with a message, with functionality to start and stop the animation.
 * @returns an object with `start` and `stop` methods to control the spinner.
 */
export const spinner = () => {
  let unblock: () => void;
  let loop: NodeJS.Timeout;
  const delay = unicode ? 80 : 120;
  return {
    start(message = "") {
      message = message.replace(/\.?\.?\.$/, "");
      unblock = block();
      process.stdout.write(
        `${color.gray(S_BAR)}\n${color.magenta("○")} ${message}\n`,
      );
      let i = 0;
      let dot = 0;
      loop = setInterval(() => {
        const frame = frames[i];
        process.stdout.write(cursor.move(-999, -1));
        process.stdout.write(
          `${color.magenta(frame)} ${message}${
            Math.floor(dot) >= 1 ? ".".repeat(Math.floor(dot)).slice(0, 3) : ""
          }   \n`,
        );
        i = i === frames.length - 1 ? 0 : i + 1;
        dot = dot === frames.length ? 0 : dot + 0.125;
      }, delay);
    },
    stop(message = "") {
      process.stdout.write(cursor.move(-999, -2));
      process.stdout.write(erase.down(2));
      clearInterval(loop);
      process.stdout.write(
        `${color.gray(S_BAR)}\n${color.green(S_STEP_SUBMIT)} ${message}\n`,
      );
      unblock();
    },
  };
};

// Adapted from https://github.com/chalk/ansi-regex
// @see LICENSE
function ansiRegex() {
  const pattern = [
    String.raw`[\u001B\u009B][[\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\d\/#&.:=?%@~_]+)*|[a-zA-Z\d]+(?:;[-a-zA-Z\d\/#&.:=?%@~_]*)*)?\u0007)`,
    String.raw`(?:(?:\d{1,4}(?:;\d{0,4})*)?[\dA-PR-TZcf-nq-uy=><~]))`,
  ].join("|");

  return new RegExp(pattern, "g");
}

export type PromptGroupAwaitedReturn<T> = {
  [P in keyof T]: Exclude<Awaited<T[P]>, symbol>;
};

export interface PromptGroupOptions<T> {
  /**
   * Control how the group can be canceled
   * if one of the prompts is canceled.
   */
  onCancel?: (opts: {
    results: Prettify<Partial<PromptGroupAwaitedReturn<T>>>;
  }) => void;
}

// eslint-disable-next-line @typescript-eslint/ban-types
type Prettify<T> = {} & {
  [P in keyof T]: T[P];
};

export type PromptGroup<T> = {
  [P in keyof T]: (opts: {
    results: Prettify<Partial<PromptGroupAwaitedReturn<Omit<T, P>>>>;
  }) => void | Promise<T[P] | void>;
};

/**
 * Groups multiple prompts together so that they can be displayed and resolved in sequence.
 * @param {PromptGroup<T>} prompts - The prompts to display in the group. See {@link PromptGroup}.
 * @param {PromptGroupOptions<T>} [opts] - Optional settings for the prompt group. See {@link PromptGroupOptions}.
 * @returns {Promise<Prettify<PromptGroupAwaitedReturn<T>>>} A promise that resolves to an object containing the results of each prompt in the group.
 */
export const group = async <T>(
  prompts: PromptGroup<T>,
  opts?: PromptGroupOptions<T>,
): Promise<Prettify<PromptGroupAwaitedReturn<T>>> => {
  const results = {} as any;
  const promptNames = Object.keys(prompts);

  for (const name of promptNames) {
    const prompt = prompts[name as keyof T];
    const result = await prompt({ results })?.catch((e) => {
      throw e;
    });

    // Pass the results to the onCancel function
    // so the user can decide what to do with the results
    // TODO: Switch to callback within core to avoid isCancel Fn
    if (typeof opts?.onCancel === "function" && isCancel(result)) {
      results[name] = "canceled";
      opts.onCancel({ results });
      continue;
    }

    results[name] = result;
  }

  return results;
};
