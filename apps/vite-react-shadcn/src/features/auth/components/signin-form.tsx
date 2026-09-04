import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInSchema, type SignInValues } from '../schemas/auth.schema';
import { useSignIn } from '../api/auth.mutation';

export const SignInForm = () => {
  const signIn = useSignIn();

  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    mode: 'onChange',
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (values: SignInValues) => {
    const res = await signIn.mutateAsync(values);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        {/* username / email  */}
        <Controller
          name="username"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="identifier">Username or email</FieldLabel>
              <Input
                id="identifier"
                placeholder="diaz.adrianz"
                {...field}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* password  */}
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <div className="flex items-center">
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Button
                  variant={'link'}
                  size={'sm'}
                  className="ms-auto"
                  asChild
                >
                  <Link to={'/auth/forgot-password'}>Forgot password?</Link>
                </Button>
              </div>
              <Input
                id="password"
                type="password"
                {...field}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Field>
          <Button
            type="submit"
            disabled={!form.formState.isValid || form.formState.isSubmitting}
          >
            Login
          </Button>
          <FieldDescription className="text-center">
            Don&apos;t have an account?
            <Button type="button" variant={'link'} size={'sm'} asChild>
              <Link to={'/auth/sign-up'}>Sign up</Link>
            </Button>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
};
