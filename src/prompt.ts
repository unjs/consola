import { text, confirm, select, multiselect } from "./utils/prompt";

type SelectOption = {
  label: string;
  value: string;
  hint?: string;
};

export type TextOptions = {
  type?: "text";
  default?: string;
  placeholder?: string;
  initial?: string;
};

export type ConfirmOptions = {
  type: "confirm";
  initial?: boolean;
};

export type SelectOptions = {
  type: "select";
  initial?: string;
  options: (string | SelectOption)[];
};

export type MultiSelectOptions = {
  type: "multiselect";
  initial?: string;
  options: string[] | SelectOption[];
  required?: boolean;
};

export type PromptOptions =
  | TextOptions
  | ConfirmOptions
  | SelectOptions
  | MultiSelectOptions;

type inferPromptReturnType<T extends PromptOptions> = T extends TextOptions
  ? string
  : T extends ConfirmOptions
  ? boolean
  : T extends SelectOptions
  ? T["options"][number]
  : T extends MultiSelectOptions
  ? T["options"]
  : unknown;

export async function prompt<T extends PromptOptions = TextOptions>(
  message: string,
  opts: PromptOptions = {}
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
        typeof o === "string" ? { value: o, label: o } : o
      ),
    })) as any;
  }

  if (opts.type === "multiselect") {
    return (await multiselect({
      message,
      options: opts.options.map((o) =>
        typeof o === "string" ? { value: o, label: o } : o
      ),
      required: opts.required,
    })) as any;
  }

  throw new Error(`Unknown prompt type: ${opts.type}`);
}
