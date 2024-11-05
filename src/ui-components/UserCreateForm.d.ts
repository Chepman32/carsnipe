/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
export declare type EscapeHatchProps = {
    [elementHierarchy: string]: Record<string, unknown>;
} | null;
export declare type VariantValues = {
    [key: string]: string;
};
export declare type Variant = {
    variantValues: VariantValues;
    overrides: EscapeHatchProps;
};
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type UserCreateFormInputValues = {
    nickname?: string;
    money?: number;
    email?: string;
    avatar?: string;
    bio?: string;
    sold?: string[];
    totalCarsOwned?: number;
    totalAuctionsParticipated?: number;
    totalBidsPlaced?: number;
    totalSpent?: number;
    totalAuctionsWon?: number;
    totalProfitEarned?: number;
};
export declare type UserCreateFormValidationValues = {
    nickname?: ValidationFunction<string>;
    money?: ValidationFunction<number>;
    email?: ValidationFunction<string>;
    avatar?: ValidationFunction<string>;
    bio?: ValidationFunction<string>;
    sold?: ValidationFunction<string>;
    totalCarsOwned?: ValidationFunction<number>;
    totalAuctionsParticipated?: ValidationFunction<number>;
    totalBidsPlaced?: ValidationFunction<number>;
    totalSpent?: ValidationFunction<number>;
    totalAuctionsWon?: ValidationFunction<number>;
    totalProfitEarned?: ValidationFunction<number>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type UserCreateFormOverridesProps = {
    UserCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    nickname?: PrimitiveOverrideProps<TextFieldProps>;
    money?: PrimitiveOverrideProps<TextFieldProps>;
    email?: PrimitiveOverrideProps<TextFieldProps>;
    avatar?: PrimitiveOverrideProps<TextFieldProps>;
    bio?: PrimitiveOverrideProps<TextFieldProps>;
    sold?: PrimitiveOverrideProps<TextFieldProps>;
    totalCarsOwned?: PrimitiveOverrideProps<TextFieldProps>;
    totalAuctionsParticipated?: PrimitiveOverrideProps<TextFieldProps>;
    totalBidsPlaced?: PrimitiveOverrideProps<TextFieldProps>;
    totalSpent?: PrimitiveOverrideProps<TextFieldProps>;
    totalAuctionsWon?: PrimitiveOverrideProps<TextFieldProps>;
    totalProfitEarned?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type UserCreateFormProps = React.PropsWithChildren<{
    overrides?: UserCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: UserCreateFormInputValues) => UserCreateFormInputValues;
    onSuccess?: (fields: UserCreateFormInputValues) => void;
    onError?: (fields: UserCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: UserCreateFormInputValues) => UserCreateFormInputValues;
    onValidate?: UserCreateFormValidationValues;
} & React.CSSProperties>;
export default function UserCreateForm(props: UserCreateFormProps): React.ReactElement;
