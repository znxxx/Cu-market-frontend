"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

function Register() {
  interface FormValues {
    student_id?: string;
    fname?: string;
    lname?: string;
    email?: string;
    password?: string;
    confirmpassword?: string;
  }
  const router = useRouter();
  const defaultdata = {
    student_id: "",
    email: "",
    fname: "",
    lname: "",
    password: "",
    confirmpassword: "",
  };
  const linkPage = (page: string) => {
    router.push(page);
  };
  const [data, setData] = useState(defaultdata);
  const [formErrors, setFormErrors] = useState<FormValues>({});

  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
    console.log(data);
    setFormErrors(validate({ ...data, [name]: value }));
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setFormErrors(validate(data));
    if (Object.keys(formErrors).length === 0) {
      console.log(data);
    }
  };

  const validate = (values: {
    student_id: string;
    email: string;
    fname: string;
    lname: string;
    password: any;
    confirmpassword: any;
  }): FormValues => {
    const errors: FormValues = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!values.student_id) {
      errors.student_id = "Student ID is required!";
    }
    if (!values.fname) {
      errors.fname = "First name is required!";
    }
    if (!values.lname) {
      errors.lname = "Last name is required";
    }
    if (!values.email) {
      errors.email = "Email is required";
    } else if (!regex.test(values.email)) {
      errors.email = "This is not a valid email format";
    }
    if (!values.password) {
      errors.password = "Password is required";
    } else if (values.password.length < 4) {
      errors.password = "Password must be more than 4 characters";
    } else if (values.password.length > 10) {
      errors.password = "Password cannot exceed more than 10 characters";
    }
    if (!values.confirmpassword) {
      errors.confirmpassword = "Please confirm your password";
    } else if (values.confirmpassword !== values.password) {
      errors.confirmpassword = "Password does not match";
    }
    return errors;
  };

  return (
    <section className="bg-[#353966] flex flex-col px-5">
      <div className="self-center flex w-[191px] max-w-full flex-col mt-20 max-md:mt-5">
        <Image
          src="/images/Cu-blackmarket-logo.svg"
          alt="logo"
          className="self-center"
          width={195}
          height={115}
        />
        <div className="self-stretch flex items-start justify-between gap-3.5"></div>
      </div>

      <div className="self-center flex w-[698px] max-w-full flex-col mt-8 mb-32 max-md:mb-10">
        <label className="text-white text-xl font-medium ml-7 max-md:ml-2.5">
          Student ID
        </label>
        <input
          type="text"
          id="student-id"
          name="student_id"
          value={data.student_id}
          onChange={handleInputChange}
          className="text-neutral-300 text-xl font-medium self-stretch shadow-[4px_4px_6px_5px_rgba(0,0,0,0.15)] bg-[#40477B] mt-2.5 pt-5 pb-5 px-5 rounded-[50px] max-md:max-w-full max-md:pl-2"
        />
        {formErrors.student_id && (
          <p className="text-red-500 ml-4">{formErrors.student_id}</p>
        )}
        <label className="text-white text-xl font-medium ml-7 mt-3 max-md:ml-2.5">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={data.email}
          onChange={handleInputChange}
          className="text-neutral-300 text-xl font-medium self-stretch shadow-[4px_4px_6px_5px_rgba(0,0,0,0.15)] bg-[#40477B] mt-2.5 pt-6 pb-5 px-5 rounded-[50px] max-md:max-w-full max-md:pl-2"
          required
        />
        {formErrors.email && (
          <p className="text-red-500 ml-4">{formErrors.email}</p>
        )}
        <label className="text-white text-xl font-medium ml-7 mt-3 max-md:ml-2.5">
          Firstname
        </label>
        <input
          type="text"
          id="firstname"
          name="fname"
          value={data.fname}
          onChange={handleInputChange}
          className="text-neutral-300 text-xl font-medium self-stretch shadow-[4px_4px_6px_5px_rgba(0,0,0,0.15)] bg-[#40477B] mt-2.5 pt-6 pb-5 px-5 rounded-[50px] max-md:max-w-full max-md:pl-2"
        />
        {formErrors.fname && (
          <p className="text-red-500 ml-4">{formErrors.fname}</p>
        )}

        <label className="text-white text-xl font-medium ml-7 mt-3 max-md:ml-2.5">
          Lastname
        </label>
        <input
          type="text"
          id="lastname"
          name="lname"
          value={data.lname}
          onChange={handleInputChange}
          className="text-neutral-300 text-xl font-medium self-stretch shadow-[4px_4px_6px_5px_rgba(0,0,0,0.15)] bg-[#40477B] mt-2.5 pt-6 pb-5 px-5 rounded-[50px] max-md:max-w-full max-md:pl-2"
        />
        {formErrors.lname && (
          <p className="text-red-500 ml-4">{formErrors.lname}</p>
        )}

        <label className="text-white text-xl font-medium ml-7 mt-3 max-md:ml-2.5">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={data.password}
          onChange={handleInputChange}
          className="text-neutral-300 text-xl font-medium self-stretch shadow-[4px_4px_6px_5px_rgba(0,0,0,0.15)] bg-[#40477B] mt-2.5 pt-6 pb-5 px-5 rounded-[50px] max-md:max-w-full max-md:mr-px"
        />
        {formErrors.password && (
          <p className="text-red-500 ml-4">{formErrors.password}</p>
        )}
        <label className="text-white text-xl font-medium ml-7 mt-3 max-md:ml-2.5">
          Confirm Password
        </label>
        <input
          type="password"
          id="confirm-password"
          name="confirmpassword"
          value={data.confirmpassword}
          onChange={handleInputChange}
          className="text-neutral-300 text-xl font-medium self-stretch shadow-[4px_4px_6px_5px_rgba(0,0,0,0.15)] bg-[#40477B] mt-2.5 pt-6 pb-5 px-5 rounded-[50px] max-md:max-w-full max-md:mr-px"
        />
        {formErrors.confirmpassword && (
          <p className="text-red-500 ml-4">{formErrors.confirmpassword}</p>
        )}

        <button className="shadow-2xl self-center flex w-[350px] max-w-full flex-col mt-12 max-md:mt-10">
          <div className="bg-[#FF8BBC] self-stretch flex w-full grow flex-col rounded-[50px] py-5 shadow-black shadow-inner">
            <span className="text-stone-100 text-xl font-medium self-center">
              Register
            </span>
          </div>
        </button>
        <button
          onClick={() => linkPage("/login")}
          className="self-center flex w-[350px] max-w-full grow flex-col mt-4"
        >
          <div className="bg-[#353966] self-stretch flex w-full grow flex-col py-5 rounded-[50px] border-[5px] border-solid border-[#FF8BBC]">
            <span className="text-stone-100 text-xl font-medium self-center">
              Already have an account
            </span>
          </div>
        </button>
      </div>
    </section>
  );
}

export default Register;