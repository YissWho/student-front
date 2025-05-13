import { ReactNode } from 'react';

export interface SelectOption {
  label: string;
  value: string | number;
}

// 基础字段接口
interface BaseFormField {
  name: string;
  label: string;
  type: 'input' | 'select' | 'datePicker' | 'rangePicker';
  showTime?: boolean;
}

// 输入框字段
interface InputField extends BaseFormField {
  type: 'input';
}

// 选择框字段
interface SelectField extends BaseFormField {
  type: 'select';
  options: SelectOption[];
  loading?: boolean;
}

// 日期选择器字段
interface DatePickerField extends BaseFormField {
  type: 'datePicker';
}

// 日期范围选择器字段
interface RangePickerField extends BaseFormField {
  type: 'rangePicker';
  showTime?: boolean;
}

export type FormField = InputField | SelectField | DatePickerField | RangePickerField;

export interface BasicFormProps {
  onSearch: (values: any) => void;
  onReset?: () => void;
  loading?: boolean;
  fields: FormField[];
  extraButtons?: ReactNode;
} 