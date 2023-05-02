import React from "react";
import ReactDOM from "react-dom/client";
import { FieldApi, createFormFactory, useForm } from "@tanstack/react-form";

type Person = {
  firstName: string;
  lastName: string;
  hobbies: Hobby[];
};

type Hobby = {
  name: string;
  description: string;
};

function FieldInfo({ field }: { field: FieldApi<any, any> }) {
  return (
    <>
      {field.state.meta.touchedError ? (
        <em>{field.state.meta.touchedError}</em>
      ) : null}{" "}
      {field.state.meta.isValidating ? "Validating..." : null}
    </>
  );
}

export default function App() {
  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
    },
    onSubmit: async (values) => {
      console.log(values);
    },
    onInvalidSubmit: () => {
      console.log("Invalid submit");
    },
  });

  return (
    <div>
      <h1>Simple Form Example</h1>
      <form.Form>
        <div>
          <form.Field
            name="firstName"
            validate={(value) => !value && "A first name is required"}
            validateAsync={async (value) => {
              await new Promise((resolve) => setTimeout(resolve, 1000));
              return (
                value.includes("error") && 'No "error" allowed in first name'
              );
            }}
            children={(field) => (
              <>
                <label htmlFor={field.name}>First Name:</label>
                <input
                  autoComplete="off"
                  name={field.name}
                  {...field.getInputProps({
                    onBlur: () => console.log("Blur first name field"),
                  })}
                />
                <FieldInfo field={field} />
              </>
            )}
          />
        </div>
        <div>
          <form.Field
            name="lastName"
            children={(field) => (
              <>
                <label htmlFor={field.name}>Last Name:</label>
                <input name={field.name} {...field.getInputProps()} />
                <FieldInfo field={field} />
              </>
            )}
          />
        </div>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <button onClick={() => form.validateAllFields()} type="submit">
              {isSubmitting ? "..." : "Submit"}
            </button>
          )}
        />
      </form.Form>
    </div>
  );
}

const rootElement = document.getElementById("root")!;
ReactDOM.createRoot(rootElement).render(<App />);
