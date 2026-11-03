import { Controller, useForm } from 'react-hook-form';
import {
  acceptInviteCheckSchema,
  acceptInviteSchema,
  type AcceptInviteCheckValues,
  type AcceptInviteValues,
} from '../schemas/identity.schema';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  useAcceptInvite,
  useAcceptInviteCheck,
} from '../api/identity.mutation';
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
import { Item, ItemContent, ItemTitle } from '@/components/ui/item';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import { useState } from 'react';
import { RiAccountCircleLine, RiEyeLine, RiEyeOffLine } from '@remixicon/react';
import { useNavigate } from 'react-router-dom';
import authStore from '@/stores/auth.store';
import { useConfirm } from '@/components/shared/confirm';
import { useAuth } from '@/features/auth';

function AcceptInviteFormOtp({
  onSubmit,
}: {
  onSubmit: (values: AcceptInviteCheckValues) => void;
}) {
  const form = useForm<AcceptInviteCheckValues>({
    resolver: yupResolver(acceptInviteCheckSchema),
    mode: 'onChange',
    defaultValues: { otp: '' },
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
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
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
    </form>
  );
}

function AcceptInviteFormSetup({
  otp,
  onSubmit,
}: {
  otp: string;
  onSubmit: (values: AcceptInviteValues) => void;
}) {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<AcceptInviteValues>({
    resolver: yupResolver(acceptInviteSchema),
    mode: 'onChange',
    defaultValues: { otp, password: '', matchPassword: '' },
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
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
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Field>
          <Button
            type="submit"
            disabled={!form.formState.isValid || form.formState.isSubmitting}
          >
            Set Up
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}

function AcceptInviteForm() {
  const authStatus = authStore((s) => s.status);

  const navigate = useNavigate(),
    confirm = useConfirm();

  const { signOut } = useAuth();

  const [otp, setOtp] = useState('');

  const checkApi = useAcceptInviteCheck(),
    setupApi = useAcceptInvite({
      async onSuccess() {
        if (authStatus !== 'authenticated') {
          navigate('/auth/signin', { replace: true });
          return;
        }

        const switchAccount = await confirm({
          title: "You're already signed in",
          description:
            'Your invitation was accepted. Sign out to sign in with the new account, or stay signed in with the current one.',
          confirmText: 'Sign out',
          cancelText: 'Stay signed in',
          Icon: RiAccountCircleLine,
        });

        if (!switchAccount) {
          navigate('/', { replace: true });
          return;
        }

        try {
          await signOut();
          navigate('/auth/signin', { replace: true });
        } catch {
          navigate('/', { replace: true });
        }
      },
    });

  const check = (values: AcceptInviteCheckValues) => {
    setOtp(values.otp);
    toast.promise(checkApi.mutateAsync(values), {
      loading: 'Verifying OTP...',
      success: 'OTP verified',
    });
  };

  const setup = (values: AcceptInviteValues) => {
    toast.promise(setupApi.mutateAsync(values), {
      loading: 'Setting up your account...',
      success: 'Account setted up',
    });
  };

  const verified = checkApi.isSuccess,
    verifiedData = checkApi.data?.data.data;

  return (
    <FieldSet>
      <FieldLegend className="text-center">Accept invitation</FieldLegend>
      <FieldDescription className="text-center">
        {verified
          ? 'OTP verified. Set up your account to join.'
          : 'Enter the OTP we emailed you to verify your invitation.'}
      </FieldDescription>

      {verified && verifiedData && (
        <Item variant="muted" size="sm">
          <ItemContent>
            <ItemTitle>{verifiedData.email}</ItemTitle>
          </ItemContent>
        </Item>
      )}

      {verified ? (
        <AcceptInviteFormSetup otp={otp} onSubmit={setup} />
      ) : (
        <AcceptInviteFormOtp onSubmit={check} />
      )}
    </FieldSet>
  );
}

export { AcceptInviteForm };
