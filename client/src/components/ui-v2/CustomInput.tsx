

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    className?: string;
}

const CustomInput: React.FC<InputProps> = ({ className, ...props }) => {
    return (
        <input
            {...props}
            className={`w-full p-3 bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none ${className}`}
        />
    );
};

export default CustomInput;
