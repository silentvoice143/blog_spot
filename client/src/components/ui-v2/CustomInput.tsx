interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  label?: string;
  error?: string;
  subdescription?: string;
}

const CustomInput: React.FC<InputProps> = ({
  className,
  label,
  error,
  subdescription,
  ...props
}) => {
  return (
    <div className="my-2 w-full">
      {label && <p className="text-base font-montserrat">{label}</p>}
      <input
        {...props}
        className={`w-full px-3 py-2 text-base font-montserrat bg-transparent disabled:bg-gray-secondary2 text-gray-900 placeholder-gray-500 focus:outline-none ${className} border border-gray-secondary3 rounded-lg mb-2`}
      />
      {subdescription && (
        <p className="text-xs font-montserrat text-gray-secondary2">
          {subdescription}
        </p>
      )}
      {error && <p className="text-xs font-montserrat text-red-500">{error}</p>}
    </div>
  );
};

export default CustomInput;
