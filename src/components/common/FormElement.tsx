import React from "react";

const FormElement = ({
  name,
  value,
  type,
  id,
  onChange,
  width,
  disabled,
}: {
  name: string;
  value: string;
  type: string;
  id: string;
  width?: string;
  disabled?: boolean;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
}) => {
  return (
    <div className="flex flex-row flex-wrap  items-center justify-start gap-1 md:gap-5">
      <label htmlFor={id} className="text-base font-hollirood tracking-widest font-semibold md:text-lg">
        {name} :
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        required
        name={id}
        disabled={disabled}
        id={id}
        className={`w-[${width}] rounded-xl border-x-0 border-b border-t-0 border-regalia bg-body px-2 py-1 font-sans text-regalia max-md:w-full `}
      />
    </div>
  );
};
export default FormElement;
