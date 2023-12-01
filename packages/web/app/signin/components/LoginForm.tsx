"use client";

import * as React from "react";
import { SignInResponse, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import NumericInput from "@/components/NumericInput";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";

interface LoginFormData {
  phoneNumber: string;
  code: string;
  username?: string;
}

export interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<SignInResponse | undefined>;
  onCallback?: () => void;
}

const LoginForm = ({ onSubmit, onCallback }: LoginFormProps) => {
  const session = useSession();

  const router = useRouter();
  const { register, trigger, handleSubmit } = useForm<LoginFormData>();
  const [showCodeField, setShowCodeField] = useState(false);
  const [showNameField, setShowNameField] = useState(false);

  const handleVerify = async () => {
    const isValidPhoneNumber = await trigger("phoneNumber", {
      shouldFocus: true,
    });
    if (!isValidPhoneNumber) {
      return;
    }

    /*
     * 문자 인증 요청
     */

    setShowCodeField(true);
  };

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit(async (data, e) => {
        if (!showCodeField) {
          return;
        }

        const res = await onSubmit(data);

        if (res?.error === "need to register") {
          setShowNameField(true);
          return;
        }

        if (res?.ok) {
          if (onCallback) {
            await onCallback();
          } else {
            router.replace("/");
          }
        }
      })}
    >
      <div className="space-y-2">
        <Label htmlFor="phone-number">Phone Number</Label>
        <NumericInput
          id="phone-number"
          placeholder="01012341234"
          maxLength={11}
          {...register("phoneNumber", {
            required: true,
            pattern: /^01[0-9]{9}$/,
          })}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleVerify();
            }
          }}
          readOnly={showCodeField || showNameField}
        />
      </div>
      <Button
        className="mb-4 w-full"
        variant="outline"
        type="button"
        onClick={handleVerify}
      >
        Request Code
      </Button>
      {showCodeField && (
        <div className="space-y-2">
          <Label htmlFor="verification-code">Verification Code</Label>
          <NumericInput
            id="code"
            placeholder="000000"
            maxLength={6}
            {...register("code", {
              required: true,
              pattern: /^[0-9]{6}$/,
            })}
            readOnly={showNameField}
          />
        </div>
      )}
      {showNameField && (
        <Input
          placeholder="홍길동"
          maxLength={6}
          {...register("username", {
            required: true,
          })}
        />
      )}
      <Button className="w-full" type="submit">
        Sign In
      </Button>
    </form>
  );
};

export default LoginForm;
