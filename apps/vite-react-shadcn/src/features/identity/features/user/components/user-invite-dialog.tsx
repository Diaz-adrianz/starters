import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { DialogState } from '@/hooks/use-dialog';
import { useInviteUser } from '../api/user.mutation';
import { Controller, useForm } from 'react-hook-form';
import {
  inviteUserSchema,
  type InviteUserValues,
} from '../schemas/user.schema';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'sonner';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { RoleCombobox } from '@/features/access-control';
import { useState } from 'react';

function UserInviteDialog({
  open,
  onOpenChange,
  hide,
}: DialogState & {
  onSuccess?: () => void;
}) {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  const form = useForm<InviteUserValues>({
    resolver: yupResolver(inviteUserSchema),
    mode: 'onChange',
    defaultValues: { username: '', email: '', roles: [] },
  });

  const inviteApi = useInviteUser({
    onSuccess() {
      hide();
      form.reset();
    },
  });

  const invite = (values: InviteUserValues) => {
    toast.promise(inviteApi.mutateAsync(values), {
      loading: 'Inviting an account...',
      success: 'Account invited',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent ref={setContainer}>
        <DialogHeader>
          <DialogTitle>Invite Account</DialogTitle>
          <DialogDescription>
            The invited account will receive an email to set up their
            credentials. The invitation expires in 24 hours.
          </DialogDescription>
        </DialogHeader>

        <form
          id="form-user-invite"
          onSubmit={form.handleSubmit(invite)}
          className="-mx-4 no-scrollbar max-h-[60vh] overflow-y-auto px-4 pb-2"
        >
          <FieldGroup>
            <Controller
              name="username"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Username</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    placeholder="johndoe"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="email"
                    placeholder="johndoe@example.com"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="roles"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Roles</FieldLabel>
                  <RoleCombobox
                    side="top"
                    container={container}
                    id={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                    invalid={fieldState.invalid}
                    disabled={field.disabled}
                    onBlur={field.onBlur}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>

        <DialogFooter>
          <Button
            className="w-full"
            type="submit"
            form="form-user-invite"
            disabled={!form.formState.isValid || form.formState.isSubmitting}
          >
            Invite
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { UserInviteDialog };
