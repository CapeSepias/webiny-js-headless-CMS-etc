import React, { useMemo, useCallback } from "react";
import { css } from "emotion";
import classNames from "classnames";
import { FormElementMessage } from "@webiny/ui/FormElementMessage";
import { BindComponentRenderPropValidation, Form } from "@webiny/form";
import InputField from "./InputField";
import SelectField from "./SelectField";

const defaultWrapperStyle = css({
    width: 60,
    "& .inner-wrapper": {
        display: "flex"
    }
});

const defaultInputStyle = css({
    appearance: "none",
    background: "transparent",
    border: "none",
    margin: 0,
    fontSize: 11,
    padding: 0,
    width: 24,
    textAlign: "right",

    transition: "all 200ms ease-in",

    "&:focus": {
        padding: "0px 4px",
        width: 36,
        textAlign: "center",
        outlineColor: "lightblue"
    }
});

const defaultSelectStyle = css({
    appearance: "none",
    background: "transparent",
    border: "none",
    padding: "0px 0px 0px 4px",
    margin: 0,
    fontSize: 12,
    width: 28,
    backgroundImage: "none",
    "&:focus": {
        outlineWidth: 2,
        outlineStyle: "solid",
        outlineColor: "lightblue"
    }
});

interface SpacingPickerProps {
    value: string;
    onChange: (value: string | number) => void;
    options: any[];
    disabled?: boolean;
    useDefaultStyle?: boolean;
    validation?: BindComponentRenderPropValidation;
    className?: string;
    inputClassName?: string;
    selectClassName?: string;
}

interface SpacingPickerFormData {
    unit: "auto" | string;
    value: string;
}

const SpacingPicker: React.FC<SpacingPickerProps> = ({
    value,
    onChange,
    disabled,
    options = [],
    validation,
    className,
    inputClassName,
    selectClassName,
    useDefaultStyle = true
}) => {
    const formData = useMemo(() => {
        const parsedValue = parseInt(value);
        const regx = new RegExp(`${parsedValue}`, "g");
        const unit = value.replace(regx, "");

        if (Number.isNaN(parsedValue) && unit === "auto") {
            return {
                value: "",
                unit
            };
        }
        return {
            value: parsedValue,
            unit
        };
    }, [value]);

    const defaultUnitValue: string | undefined = options[0] ? options[0].value : undefined;

    const onFormChange = useCallback((formData: SpacingPickerFormData) => {
        if (formData.unit === "auto") {
            onChange(formData.unit);
            return;
        } else if (formData.value !== undefined && formData.value !== "") {
            onChange(formData.value + (formData.unit || defaultUnitValue));
            return;
        }
        onChange("");
    }, []);

    return (
        <Form
            data={formData}
            onChange={data => {
                /**
                 * We are positive that data is SpacingPickerFormData.
                 */
                return onFormChange(data as unknown as SpacingPickerFormData);
            }}
        >
            {({ data, Bind }) => {
                const unitValue = data.unit || defaultUnitValue;
                return (
                    <div
                        className={classNames(className, {
                            [defaultWrapperStyle]: useDefaultStyle
                        })}
                    >
                        <div className={"inner-wrapper"}>
                            <Bind name={"value"}>
                                <InputField
                                    className={classNames(inputClassName, {
                                        [defaultInputStyle]: useDefaultStyle
                                    })}
                                    disabled={data.unit === "auto" || disabled}
                                    type={"number"}
                                />
                            </Bind>
                            <Bind name={"unit"}>
                                <SelectField
                                    className={classNames(selectClassName, {
                                        [defaultSelectStyle]: useDefaultStyle
                                    })}
                                    disabled={disabled}
                                    value={unitValue}
                                >
                                    {options.map(item => (
                                        <option key={item.value} value={item.value}>
                                            {item.label}
                                        </option>
                                    ))}
                                </SelectField>
                            </Bind>
                        </div>
                        {validation && validation.isValid === false && (
                            <FormElementMessage error>{validation.message}</FormElementMessage>
                        )}
                    </div>
                );
            }}
        </Form>
    );
};

export default React.memo(SpacingPicker);
