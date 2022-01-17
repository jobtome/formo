import { Reducer, useState } from "react";
import { useRefReducer } from "./useRefReducer";
import { FieldProps } from "./FieldProps";
import { NonEmptyArray } from "./NonEmptyArray";
import { Validator } from "./Validator";
import {
  failure,
  isFailure,
  isSuccess,
  matchResult,
  Result,
  success,
} from "./Result";

type ComputedFieldProps<V, Label, Issues> = Pick<
  FieldProps<V, Label, Issues>,
  "name" | "value" | "onChange" | "onBlur" | "issues"
> & { isTouched: boolean; disabled: boolean };

type FieldValidators<Values> = {
  [k in keyof Values]: Validator<Values[k], unknown, unknown>;
};

type FieldArrayValidators<Values> = {
  [k in FieldArrayKeys<Values>]: Partial<
    FieldValidators<
      ArrayRecord<Values, keyof FieldArrayValues<Values> & string>[k][number]
    >
  >;
};

type GetOrElse<A, B> = A extends undefined | null ? B : NonNullable<A>;

type ValidatedValues<
  Values,
  Validators extends Partial<FieldValidators<Values>>,
  ArrayValidators extends Partial<FieldArrayValidators<Values>>
> = {
  // The `Required<>` is needed to remove the optionality on the values received
  // onSubmit while keeping the possibly undefined type for non-validated fields.
  // Without this e.g. `field?: string | undefined`, if validated using `defined()`,
  // would still appear as `field?: string` and thus `string | undefined` in `onSubmit`
  [k in keyof Required<Values>]: Validators[k] extends Validator<
    Values[k],
    infer O,
    infer _E
  >
    ? O
    : Validators[k] extends Validator<Values[k], infer O, infer _E> | undefined
    ? O | Values[k]
    : k extends FieldArrayKeys<Values>
    ? ValidatedValues<
        ArrayRecord<Values, keyof FieldArrayValues<Values> & string>[k][number],
        GetOrElse<ArrayValidators[k], {}>,
        {}
      >[]
    : Values[k];
};

type FormOptions<
  Values,
  Validators extends Partial<FieldValidators<Values>>,
  ArrayValidators extends Partial<FieldArrayValidators<Values>>,
  FormErrors
> = [
  {
    initialValues: Values;
    fieldValidators: (values: Values) => Validators;
    fieldArrayValidators?: (values: Values, index: number) => ArrayValidators;
    validateOnChange?: boolean;
    validateOnBlur?: boolean;
  },
  {
    onSubmit: (
      values: ValidatedValues<Values, Validators, ArrayValidators>
    ) => Promise<Result<FormErrors, unknown>>;
  }
];

type ArrayFieldValue<A extends unknown[]> = A & { __isFieldArray: true };

export function subForm<A extends unknown[]>(
  arrayFieldValue: A
): ArrayFieldValue<A> {
  (arrayFieldValue as any).__isFieldArray = true;
  return arrayFieldValue as any;
}

type ArrayRecord<Values, SK extends string> = {
  [K in keyof Values]: Values[K] extends { [k in SK]: unknown }[]
    ? Values[K]
    : never;
};

type FieldArrayKeys<Values> = {
  [K in keyof Values]-?: Values[K] extends ArrayFieldValue<unknown[]>
    ? K
    : never;
}[keyof Values] &
  string;

type FieldArrayValues<Values> = {
  [K in keyof Values]-?: Values[K] extends ArrayFieldValue<unknown[]>
    ? Values[K][number]
    : never;
}[keyof Values];

type SimpleValueKeys<Values> = {
  [K in keyof Values]-?: Values[K] extends ArrayFieldValue<unknown[]>
    ? never
    : K;
}[keyof Values] &
  string;

type FormAction<Values, FormErrors, FieldError> =
  | {
      type: "setValues";
      values: Partial<Values>;
    }
  | {
      type: "setTouched";
      touched: Partial<Record<keyof Values, boolean>>;
    }
  | {
      type: "setErrors";
      field: keyof Values;
      errors?: NonEmptyArray<FieldError>;
    }
  | {
      type: "setFieldArrayTouched";
      field: FieldArrayKeys<Values>;
      index: number;
      subfield: string;
      touched: boolean;
    }
  | {
      type: "setFieldArrayErrors";
      field: FieldArrayKeys<Values>;
      index: number;
      subfield: string;
      errors?: NonEmptyArray<FieldError>;
    }
  | {
      type: "setFormError";
      errors?: FormErrors;
    }
  | {
      type: "setSubmitting";
      isSubmitting: boolean;
    }
  | {
      type: "reset";
      state: FormState<Values, FormErrors, FieldError>;
    };

type FieldArray<
  Values extends Record<string, unknown>,
  K extends FieldArrayKeys<Values>,
  Label,
  FieldError
> = {
  items: {
    fieldProps: <
      SK extends keyof FieldArrayValues<Values> & string,
      V extends ArrayRecord<Values, SK>
    >(
      name: SK
    ) => ComputedFieldProps<V[K][number][SK], Label, NonEmptyArray<FieldError>>;
    onChangeValues: <
      SK extends keyof FieldArrayValues<Values> & string,
      V extends ArrayRecord<Values, SK>
    >(
      v: V[K][number]
    ) => unknown;
    remove: () => void;
    namePrefix: string;
  }[];
  insertAt: <
    SK extends keyof FieldArrayValues<Values> & string,
    V extends ArrayRecord<Values, SK>
  >(
    index: number,
    value: V[K][number]
  ) => void;
  push: <
    SK extends keyof FieldArrayValues<Values> & string,
    V extends ArrayRecord<Values, SK>
  >(
    value: V[K][number]
  ) => void;
};

interface FormState<Values, FormErrors, FieldError> {
  values: Values;
  touched: Record<keyof Values, boolean>;
  errors: Partial<Record<keyof Values, NonEmptyArray<FieldError>>>;
  formErrors?: FormErrors;
  isSubmitting: boolean;
  fieldArrayTouched: Record<
    FieldArrayKeys<Values>,
    Array<Partial<Record<keyof FieldArrayValues<Values>, boolean>>>
  >;
  fieldArrayErrors: Record<
    FieldArrayKeys<Values>,
    Array<{
      [K in keyof FieldArrayValues<Values>]?:
        | NonEmptyArray<FieldError>
        | undefined;
    }>
  >;
}

function formReducer<Values, FormErrors, FieldError>(
  state: FormState<Values, FormErrors, FieldError>,
  action: FormAction<Values, FormErrors, FieldError>
): FormState<Values, FormErrors, FieldError> {
  switch (action.type) {
    case "setValues":
      return { ...state, values: { ...state.values, ...action.values } };
    case "setTouched":
      return { ...state, touched: { ...state.touched, ...action.touched } };
    case "setErrors":
      return {
        ...state,
        errors: { ...state.errors, [action.field]: action.errors },
      };
    case "setFieldArrayTouched":
      const touchedSubfields =
        state.fieldArrayTouched[action.field][action.index] ?? {};

      const updatedTouchedField = [
        ...state.fieldArrayTouched[action.field].slice(0, action.index),
        {
          ...touchedSubfields,
          [action.subfield]: action.touched,
        },
        ...state.fieldArrayTouched[action.field].slice(
          action.index + 1,
          state.fieldArrayTouched[action.field].length
        ),
      ];

      return {
        ...state,
        fieldArrayTouched: {
          ...state.fieldArrayTouched,
          [action.field]: updatedTouchedField,
        },
      };

    case "setFieldArrayErrors":
      const errorsSubfields =
        state.fieldArrayErrors[action.field][action.index] ?? {};

      const updatedErrorsField = [
        ...state.fieldArrayErrors[action.field].slice(0, action.index),
        {
          ...errorsSubfields,
          [action.subfield]: action.errors,
        },
        ...state.fieldArrayErrors[action.field].slice(
          action.index + 1,
          state.fieldArrayErrors[action.field].length
        ),
      ];

      return {
        ...state,
        fieldArrayErrors: {
          ...state.fieldArrayErrors,
          [action.field]: updatedErrorsField,
        },
      };

    case "setFormError":
      return {
        ...state,
        formErrors: action.errors,
      };
    case "setSubmitting":
      return { ...state, isSubmitting: action.isSubmitting };
    case "reset":
      return action.state;
  }
}

type UseFormReturn<
  Values extends Record<string, unknown>,
  FormErrors,
  Label,
  FieldError
> = {
  values: Values;
  setValues: (values: Partial<Values>) => void;
  setTouched: (values: Partial<Record<keyof Values, boolean>>) => void;
  fieldProps: <K extends SimpleValueKeys<Values>>(
    name: K
  ) => ComputedFieldProps<Values[K], Label, NonEmptyArray<FieldError>>;
  handleSubmit: () => Promise<Result<unknown, unknown>>;
  isSubmitting: boolean;
  fieldArray: <K extends FieldArrayKeys<Values>>(
    name: K
  ) => FieldArray<Values, K, Label, FieldError>;
  formErrors?: FormErrors;
  fieldErrors: Partial<Record<keyof Values, NonEmptyArray<FieldError>>>;
  resetForm: () => void;
  submissionCount: number;
};

type ValidatorErrorType<
  Values extends Record<string, unknown>,
  V extends Partial<FieldValidators<Values>>
> = V extends Partial<{
  [k in keyof Values]: Validator<Values[k], unknown, infer E>;
}>
  ? E extends unknown
    ? never
    : E
  : null;

function mapRecord<R extends Record<string, unknown>, B>(
  r: R,
  map: (v: R[keyof R], k: keyof R) => B
): Record<keyof R, B> {
  const result: Record<keyof R, B> = {} as any;
  for (let k in r) {
    result[k] = map(r[k], k);
  }
  return result;
}

export function useFormo<
  Values extends Record<string, unknown>,
  Validators extends Partial<FieldValidators<Values>>,
  ArrayValidators extends Partial<FieldArrayValidators<Values>>,
  FormErrors,
  Label
>(
  ...args: FormOptions<Values, Validators, ArrayValidators, FormErrors>
): UseFormReturn<
  Values,
  FormErrors,
  Label,
  ValidatorErrorType<Values, Validators>
> {
  type Touched = Record<keyof Values, boolean>;
  type FieldError = ValidatorErrorType<Values, Validators>;

  type Errors = Partial<Record<keyof Values, NonEmptyArray<FieldError>>>;
  type FieldArrayErrors = Record<
    FieldArrayKeys<Values>,
    Array<
      Partial<Record<keyof FieldArrayValues<Values>, NonEmptyArray<FieldError>>>
    >
  >;
  type FieldArrayTouched = Record<
    FieldArrayKeys<Values>,
    Record<keyof FieldArrayValues<Values>, boolean>[]
  >;

  const [
    {
      initialValues,
      fieldValidators,
      fieldArrayValidators,
      validateOnBlur: validateOnBlur_,
      validateOnChange: validateOnChange_,
    },
    { onSubmit },
  ] = args;
  const validateOnChange = validateOnChange_ != null ? validateOnChange_ : true;
  const validateOnBlur = validateOnBlur_ != null ? validateOnBlur_ : true;

  const [submissionCount, setSubmissionCount] = useState(0);

  const fileArrayKeys = Object.keys(initialValues).filter(
    (k) => initialValues[k] && (initialValues[k] as any).__isFieldArray
  );

  type ArrayValues = Record<
    FieldArrayKeys<Values>,
    Array<Record<keyof FieldArrayValues<Values>, unknown>>
  >;

  const arrayValues = (values: Values): ArrayValues => {
    const arrayValues: ArrayValues = {} as any;
    for (let k in values) {
      if (fileArrayKeys.indexOf(k) !== -1) {
        (arrayValues as any)[k] = values[k];
      }
    }
    return arrayValues;
  };

  const initialState = {
    values: initialValues,
    touched: mapRecord(initialValues, () => false) as Touched,
    errors: {} as Errors,
    isSubmitting: false,
    fieldArrayErrors: mapRecord(arrayValues(initialValues), (arrayValues) =>
      arrayValues.map(() => ({}))
    ) as FieldArrayErrors,
    fieldArrayTouched: mapRecord(arrayValues(initialValues), (arrayValues) =>
      arrayValues.map((arrayValue) => mapRecord(arrayValue, () => false))
    ) as FieldArrayTouched,
  };

  const [state, dispatch] = useRefReducer<
    Reducer<
      FormState<Values, FormErrors, FieldError>,
      FormAction<Values, FormErrors, FieldError>
    >
  >(formReducer, initialState);

  const setValues = (partialValues: Partial<Values>): void => {
    dispatch({ type: "setValues", values: partialValues });

    const newValues = { ...state.current.values, ...partialValues };
    if (validateOnChange) {
      Object.keys(partialValues).forEach((name) =>
        validateField(name, newValues)
      );
    }
  };

  const setTouched = (partialTouched: Partial<Touched>): void => {
    const partialTouchedChanged = Object.fromEntries(
      Object.entries(partialTouched).filter(
        ([k, isTouch]) => state.current.touched[k] !== isTouch
      )
    ) as Partial<Touched>;

    if (Object.keys(partialTouchedChanged).length === 0) {
      return;
    }

    dispatch({ type: "setTouched", touched: partialTouchedChanged });
  };

  const setErrors = <K extends keyof Values & string>(
    k: K,
    newErrors?: NonEmptyArray<FieldError>
  ): void => {
    if (state.current.errors[k] == null && newErrors == null) {
      return;
    }

    dispatch({ type: "setErrors", field: k, errors: newErrors });
  };

  const setFormErrors = (errors?: FormErrors): void => {
    if (state.current.formErrors == null && errors == null) {
      return;
    }

    dispatch({ type: "setFormError", errors });
  };

  const fieldProps = <K extends keyof Values & string>(
    name: K
  ): ComputedFieldProps<Values[K], Label, NonEmptyArray<FieldError>> => {
    return {
      name,
      value: state.current.values[name],
      onChange: (v: Values[K]) => {
        setValues({ [name]: v } as unknown as Partial<Values>);
        const newValues = { ...state.current.values, [name]: v } as Values;
        if (validateOnChange) {
          return validateField(name, newValues);
        } else {
          return Promise.resolve();
        }
      },
      onBlur: () => {
        setTouched({ [name]: true } as unknown as Partial<Touched>);
        if (validateOnBlur) {
          return validateField(name, state.current.values);
        } else {
          return Promise.resolve();
        }
      },
      issues: state.current.touched[name]
        ? state.current.errors[name]
        : undefined,
      isTouched: state.current.touched[name],
      disabled: state.current.isSubmitting,
    };
  };

  async function validateField<K extends keyof Values & string>(
    name: K,
    values: Values
  ): Promise<
    Result<NonEmptyArray<ValidatorErrorType<Values, Validators>>, Values[K]>
  > {
    const fieldValidation = fieldValidators(values)[name];
    const result = fieldValidation
      ? await fieldValidation(values[name])
      : success(values[name]);
    if (result.type === "failure") {
      setErrors(name, result.failure as any);
    } else {
      setErrors(name, undefined);
    }
    return result as Result<
      NonEmptyArray<ValidatorErrorType<Values, Validators>>,
      Values[K]
    >;
  }

  async function validateSubfield<
    SK extends keyof FieldArrayValues<Values> & string,
    K extends FieldArrayKeys<Values>,
    V extends ArrayRecord<Values, SK>
  >(
    name: K,
    index: number,
    subfieldName: SK,
    values: Values
  ): Promise<Result<NonEmptyArray<FieldError>, Values[K]>> {
    if (
      fieldArrayValidators != null &&
      fieldArrayValidators(values, index) != null &&
      fieldArrayValidators(values, index)[name] != null &&
      fieldArrayValidators(values, index)[name]![subfieldName] != null
    ) {
      const subfieldValidation = fieldArrayValidators(values, index)[name]![
        subfieldName
      ]!;
      const result = (await subfieldValidation(
        (values as V)[name][index][subfieldName] as any
      )) as Result<NonEmptyArray<FieldError>, Values[K]>;
      return matchResult(result, {
        failure: (e) => {
          dispatch({
            type: "setFieldArrayErrors",
            field: name,
            index,
            subfield: subfieldName,
            errors: e,
          });
          return failure(e);
        },
        success: (a) => {
          dispatch({
            type: "setFieldArrayErrors",
            field: name,
            index,
            subfield: subfieldName,
            errors: undefined,
          });
          return success(a);
        },
      });
    } else {
      setErrors(name, undefined);
      dispatch({
        type: "setFieldArrayErrors",
        field: name,
        index,
        subfield: subfieldName,
        errors: undefined,
      });
      return success(values[name]);
    }
  }

  async function validateSubform<
    SK extends keyof FieldArrayValues<Values> & string,
    K extends FieldArrayKeys<Values>,
    V extends ArrayRecord<Values, SK>
  >(
    values: V,
    index: number,
    name: K
  ): Promise<
    Result<
      NonEmptyArray<FieldError>,
      ValidatedValues<
        ArrayRecord<Values, keyof FieldArrayValues<Values> & string>[K][number],
        GetOrElse<ArrayValidators[K], {}>,
        {}
      >
    >
  > {
    let failures: Array<FieldError> = [];
    let validatedValues = mapRecord(values[name][index], (v) => v);
    for (let subfieldName in values[name][index]) {
      const result = await validateSubfield(name, index, subfieldName, values);
      if (result.type === "failure") {
        failures = failures.concat(result.failure);
      } else {
        (validatedValues as any)[name] = result.success;
      }
    }
    if (failures.length > 0) {
      return failure(failures as NonEmptyArray<FieldError>);
    }
    return success(validatedValues) as any;
  }

  async function validateAllSubforms<
    SK extends keyof FieldArrayValues<Values> & string,
    K extends FieldArrayKeys<Values>,
    V extends ArrayRecord<Values, SK>
  >(
    values: Values
  ): Promise<Record<K, Result<NonEmptyArray<FieldError>, any>>> {
    const arrValues = arrayValues(values);
    const results: Record<
      K,
      Result<NonEmptyArray<FieldError>, any>
    > = {} as any;
    for (const name_ in arrValues) {
      const name: K = name_ as K;
      const subforms = arrValues[name];
      const arrayResult = await Promise.all(
        subforms.map((_, index) =>
          validateSubform<SK, K, V>(values as V, index, name)
        )
      );
      const arrayFailures = arrayResult
        .filter(isFailure)
        .flatMap((r) => r.failure);
      if (arrayFailures.length > 0) {
        results[name] = failure(arrayFailures as NonEmptyArray<FieldError>);
      } else {
        results[name] = success(
          arrayResult.filter(isSuccess).map((r) => r.success)
        );
      }
    }
    return results;
  }

  async function validateAllFields(
    values: Values
  ): Promise<
    Result<
      NonEmptyArray<FieldError>,
      ValidatedValues<Values, Validators, ArrayValidators>
    >
  > {
    let failures: Array<FieldError> = [];

    const plainValues = {} as Partial<
      ValidatedValues<Values, Validators, ArrayValidators>
    >;
    for (const name in values) {
      const result = await validateField(name, values);
      if (result.type === "failure") {
        failures = failures.concat(result.failure);
      } else {
        (plainValues as any)[name] = result.success;
      }
    }

    const subFormValidations = await validateAllSubforms(values);
    let subFormValues = {};
    for (const name in subFormValidations) {
      const result: Result<
        NonEmptyArray<ValidatorErrorType<Values, Validators>>,
        any
      > = (subFormValidations as any)[name];
      if (result.type === "failure") {
        failures = failures.concat(result.failure);
      } else {
        (subFormValues as any)[name] = result.success;
      }
    }

    if (failures.length > 0) {
      return failure(failures as NonEmptyArray<FieldError>);
    }

    return success({
      ...plainValues,
      ...subFormValues,
    }) as any;
  }

  const setAllTouched = (): void => {
    setTouched(mapRecord(state.current.values, () => true));

    mapRecord(arrayValues(state.current.values), (v, field) => {
      v.map((r, index) => {
        mapRecord(r, (_, subfield) => {
          dispatch({
            type: "setFieldArrayTouched",
            field,
            index,
            subfield: subfield as string,
            touched: true,
          });
        });
      });
    });
  };

  const fieldArray = <K extends FieldArrayKeys<Values>>(
    name: K
  ): FieldArray<Values, K, Label, FieldError> => {
    function namePrefix(index: number): string {
      return `${name}[${index}]`;
    }

    const fieldProps = <
      SK extends keyof FieldArrayValues<Values> & string,
      V extends ArrayRecord<Values, SK>
    >(
      index: number
    ): ((
      subfieldName: SK
    ) => ComputedFieldProps<
      V[K][number][SK],
      Label,
      NonEmptyArray<FieldError>
    >) => {
      return (subfieldName) => {
        const fieldArrayTouchedIndex =
          state.current.fieldArrayTouched[name][index];
        const isTouched = Boolean(
          fieldArrayTouchedIndex != null && fieldArrayTouchedIndex[subfieldName]
        );

        return {
          name: `${namePrefix(index)}.${subfieldName}`,
          value: (state.current.values as V)[name][index][
            subfieldName
          ] as V[K][number][SK],
          onChange: (value: V[K][number][SK]) => {
            const valuesArrary = (state.current.values as V)[name];
            const fieldValue = { ...(valuesArrary[index] as V[K][number]) };
            fieldValue[subfieldName] = value;
            const updatedArray = [
              ...valuesArrary.slice(0, index),
              fieldValue,
              ...valuesArrary.slice(index + 1, valuesArrary.length),
            ];
            const newValues = { [name]: updatedArray } as Partial<Values>;
            setValues(newValues);
            if (validateOnChange) {
              validateSubfield(name, index, subfieldName, {
                ...state.current.values,
                ...newValues,
              });
            }
          },
          onBlur: () => {
            dispatch({
              type: "setFieldArrayTouched",
              field: name,
              index,
              subfield: subfieldName,
              touched: true,
            });
          },
          issues: isTouched
            ? (state.current.fieldArrayErrors[name][index] || {})[subfieldName]
            : undefined,
          isTouched,
          disabled: state.current.isSubmitting,
        };
      };
    };

    function onChangeValues<
      SK extends keyof FieldArrayValues<Values> & string,
      V extends ArrayRecord<Values, SK>
    >(
      index: number
    ): FieldArray<
      Values,
      K,
      Label,
      FieldError
    >["items"][number]["onChangeValues"] {
      return (elementValues) => {
        const currentValues = state.current.values[name] as Array<
          Record<SK, V[K][number][SK]>
        >;
        const updatedArray = [
          ...currentValues.slice(0, index),
          elementValues,
          ...currentValues.slice(index + 1, currentValues.length),
        ];
        const newValues = { [name]: updatedArray } as Partial<Values>;
        setValues(newValues);
        if (validateOnChange) {
          validateSubform<SK, K, V>(
            { ...state.current.values, ...newValues } as V,
            index,
            name
          );
        }
      };
    }

    function remove<
      SK extends keyof FieldArrayValues<Values> & string,
      V extends ArrayRecord<Values, SK>
    >(index: number): () => void {
      return () => {
        const currentArray = (state.current.values as V)[name];
        const updatedArray = [
          ...currentArray.slice(0, index),
          ...currentArray.slice(index + 1, currentArray.length),
        ];
        setValues({ [name]: updatedArray } as Partial<Values>);
        const newValues = {
          ...state.current.values,
          [name]: updatedArray,
        } as Values;
        validateAllSubforms(newValues);
      };
    }

    const items: FieldArray<Values, K, Label, FieldError>["items"] = (
      state.current.values as ArrayRecord<Values, string>
    )[name].map((_value, index) => ({
      fieldProps: fieldProps(index),
      onChangeValues: onChangeValues(index),
      remove: remove(index),
      namePrefix: namePrefix(index),
    }));

    const insertAt: FieldArray<Values, K, Label, FieldError>["insertAt"] = (
      index,
      value
    ): void => {
      const array = state.current.values[name] as unknown[];
      setValues({
        [name]: [
          ...array.slice(0, index),
          value,
          ...array.slice(index, array.length),
        ],
      } as Partial<Values>);
    };

    const push: FieldArray<Values, K, Label, FieldError>["push"] = (value) =>
      insertAt((state.current.values[name] as unknown[]).length, value as any);

    return {
      items,
      push,
      insertAt,
    };
  };

  async function validateFormAndSubmit(
    values: ValidatedValues<Values, Validators, ArrayValidators>
  ): Promise<Result<unknown, unknown>> {
    const result = await onSubmit(values);
    if (result.type === "failure") {
      setFormErrors(result.failure);
    } else {
      setFormErrors(undefined);
    }
    return result;
  }

  async function handleSubmit(): Promise<Result<unknown, unknown>> {
    setAllTouched();
    dispatch({ type: "setSubmitting", isSubmitting: true });
    setSubmissionCount((count) => count + 1);
    try {
      const validatedFieldValues = await validateAllFields(
        state.current.values
      );
      if (validatedFieldValues.type === "failure") {
        return validatedFieldValues;
      }
      return validateFormAndSubmit(validatedFieldValues.success);
    } finally {
      dispatch({ type: "setSubmitting", isSubmitting: false });
    }
  }

  const resetForm: () => void = () => {
    dispatch({ type: "reset", state: initialState });
  };

  return {
    values: state.current.values,
    setValues,
    setTouched,
    fieldProps,
    handleSubmit,
    isSubmitting: state.current.isSubmitting,
    fieldArray,
    formErrors: state.current.formErrors,
    fieldErrors: state.current.errors,
    resetForm,
    submissionCount,
  };
}
