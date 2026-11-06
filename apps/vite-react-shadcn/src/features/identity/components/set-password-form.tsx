import { Controller, useForm } from 'react-hook-form';
import {
  acceptInviteCheckSchema,
  acceptInviteSchema,
  type SetPasswordCheckValues,
  type SetPasswordValues,
} from '../schemas/identity.schema';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSetPassword, useSetPasswordCheck } from '../api/identity.mutation';
import { toast } from 'sonner';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import { useState } from 'react';
import { RiEyeLine, RiEyeOffLine } from '@remixicon/react';
import { useNavigate } from 'react-router-dom';
import authStore from '@/stores/auth.store';
import { useAuth } from '@/features/auth';
import type { SetPasswordCheckResponse } from '../type/identity.type';
import { Input } from '@/components/ui/input';
import { useCountdown } from '@/hooks/use-countdown';

function SetPasswordFormOtp({
  onSubmit,
}: {
  onSubmit: (values: SetPasswordCheckValues) => void;
}) {
  const form = useForm<SetPasswordCheckValues>({
    resolver: yupResolver(acceptInviteCheckSchema),
    mode: 'onChange',
    defaultValues: { otp: '' },
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldSet>
        <FieldLegend className="text-center">Verify your request</FieldLegend>
        <FieldDescription className="text-center">
          Enter the verification code we sent to your email to continue
          resetting your password.
        </FieldDescription>
        <FieldGroup>
          <Controller
            name="otp"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                className="items-center text-center"
              >
                <InputOTP
                  maxLength={6}
                  id={field.name}
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                >
                  <InputOTPGroup className="mx-auto">
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Field>
            <Button
              type="submit"
              disabled={!form.formState.isValid || form.formState.isSubmitting}
            >
              Verify
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}

function SetPasswordFormSetup({
  otp,
  verifiedData,
  onSubmit,
}: {
  otp: string;
  verifiedData: SetPasswordCheckResponse['data'];
  onSubmit: (values: SetPasswordValues) => void;
}) {
  const expire = useCountdown(verifiedData.expiresAt);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<SetPasswordValues>({
    resolver: yupResolver(acceptInviteSchema),
    mode: 'onChange',
    defaultValues: { otp, password: '', matchPassword: '' },
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldSet>
        <FieldLegend className="text-center">Set Your New Password</FieldLegend>
        <FieldDescription className="text-center">
          Your reset request is verified. Set a new password within{' '}
          <span className="text-destructive">{expire.formattedShort}</span>.
        </FieldDescription>

        <FieldGroup>
          <Field>
            <FieldLabel>Email</FieldLabel>
            <Input disabled readOnly value={verifiedData.email} />
          </Field>

          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    {...field}
                    id={field.name}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="********"
                    aria-invalid={fieldState.invalid}
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      onClick={() => setShowPassword((s) => !s)}
                      variant="secondary"
                      size={'icon-sm'}
                    >
                      {showPassword ? <RiEyeLine /> : <RiEyeOffLine />}
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="matchPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Re-type password</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    {...field}
                    id={field.name}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="********"
                    aria-invalid={fieldState.invalid}
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      onClick={() => setShowPassword((s) => !s)}
                      variant="secondary"
                      size={'icon-sm'}
                    >
                      {showPassword ? <RiEyeLine /> : <RiEyeOffLine />}
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Field>
            <Button
              type="submit"
              disabled={!form.formState.isValid || form.formState.isSubmitting}
            >
              Reset
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}

function SetPasswordForm() {
  const authStatus = authStore((s) => s.status);

  const navigate = useNavigate();

  const { signOut } = useAuth();

  const [otp, setOtp] = useState('');

  const checkApi = useSetPasswordCheck(),
    setApi = useSetPassword({
      async onSuccess() {
        if (authStatus === 'authenticated') await signOut();
        navigate('/auth/signin', { replace: true });
      },
    });

  const check = (values: SetPasswordCheckValues) => {
    setOtp(values.otp);
    toast.promise(checkApi.mutateAsync(values), {
      loading: 'Verifying your code...',
      success: 'Verification successful.',
    });
  };

  const set = (values: SetPasswordValues) => {
    toast.promise(setApi.mutateAsync(values), {
      loading: 'Updating your password...',
      success: 'Your password has been updated.',
    });
  };

  const verified = checkApi.isSuccess,
    verifiedData = checkApi.data?.data.data;

  return verified && verifiedData ? (
    <SetPasswordFormSetup
      otp={otp}
      onSubmit={set}
      verifiedData={verifiedData}
    />
  ) : (
    <SetPasswordFormOtp onSubmit={check} />
  );
}

export { SetPasswordForm };
