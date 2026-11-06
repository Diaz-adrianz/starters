import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForgotPassword } from '../api/identity.mutation';
import {
  forgotPasswordSchema,
  type ForgotPasswordValues,
} from '../schemas/identity.schema';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

function ForgotPasswordForm() {
  const nav = useNavigate();

  const forgotPasswordApi = useForgotPassword({
    onSuccess() {
      nav('/auth/set-password', { replace: true });
    },
  });

  const form = useForm<ForgotPasswordValues>({
    resolver: yupResolver(forgotPasswordSchema),
    mode: 'onChange',
    defaultValues: { email: '' },
  });

  const forgotPassword = (values: ForgotPasswordValues) => {
    toast.promise(forgotPasswordApi.mutateAsync(values), {
      loading: 'Sending reset code...',
      success: 'Check your email for the reset code',
    });
  };

  return (
    <form onSubmit={form.handleSubmit(forgotPassword)}>
      <FieldSet>
        <FieldLegend className="text-center">Forgot password?</FieldLegend>
        <FieldDescription className="text-center">
          Enter your email and we'll send you a one-time code to reset your
          password.
        </FieldDescription>
        <FieldGroup>
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  placeholder="john@example.com"
                  aria-invalid={fieldState.invalid}
                />
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
              Send code
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}

export { ForgotPasswordForm };
