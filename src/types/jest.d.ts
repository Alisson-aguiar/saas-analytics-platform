import '@testing-library/jest-dom';

declare global {
    namespace jest {
        interface Matchers<R> {
            toBeInTheDocument(): R;
            toHaveTextContent(text: string): R;
            toBeVisible(): R;
            toBeDisabled(): R;
            toHaveClass(className: string): R;
            toHaveValue(value: string): R;
            toBeChecked(): R;
        }
    }
}