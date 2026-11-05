import type { DialogState } from '@/hooks/use-dialog';
import {
  RoleCombobox,
  type RoleComboboxItem,
} from '../../role/components/role-combobox';
import { UserCombobox, type UserComboboxItem } from '@/features/identity';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useEffect, useState } from 'react';
import {
  createRoleUserSchema,
  type CreateRoleUserValues,
} from '../schemas/role-user.schema';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCreateRoleUser } from '../api/role-user.mutation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';

type RoleUserCreateDialogPayload = {
  role?: RoleComboboxItem;
  user?: UserComboboxItem;
};

function RoleUserCreateDialog({
  open,
  onOpenChange,
  hide,
  payload,
}: DialogState<RoleUserCreateDialogPayload>) {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  const form = useForm<CreateRoleUserValues>({
    resolver: yupResolver(createRoleUserSchema),
    mode: 'onChange',
    defaultValues: { role: undefined, user: undefined },
  });

  useEffect(() => {
    if (open) form.reset({ role: payload?.role, user: payload?.user });
  }, [open, payload]);

  const createApi = useCreateRoleUser({
    onSuccess() {
      hide();
      form.reset();
    },
  });

  const create = (values: CreateRoleUserValues) => {
    toast.promise(
      createApi.mutateAsync({
        roleId: values.role.id,
        userId: values.user.id,
        username: values.user.username,
      }),
      { loading: 'Assigning role...', success: 'Role assigned' }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent ref={setContainer}>
        <DialogHeader>
          <DialogTitle>Assign Role</DialogTitle>
        </DialogHeader>

        <form
          id="form-roleuser-create"
          onSubmit={form.handleSubmit(create)}
          className="-mx-4 no-scrollbar max-h-[60vh] overflow-y-auto px-4 pb-2"
        >
          <FieldGroup>
            <Controller
              name="role"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Role</FieldLabel>
                  <RoleCombobox
                    container={container}
                    id={field.name}
                    max={1}
                    value={field.value ? [field.value] : []}
                    onValueChange={(v) =>
                      v.length
                        ? field.onChange(v.at(0))
                        : field.onChange(undefined)
                    }
                    invalid={fieldState.invalid}
                    disabled={field.disabled || !!payload?.role}
                    onBlur={field.onBlur}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="user"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>User</FieldLabel>
                  <UserCombobox
                    container={container}
                    id={field.name}
                    max={1}
                    value={field.value ? [field.value] : []}
                    onValueChange={(v) =>
                      v.length
                        ? field.onChange(v.at(0))
                        : field.onChange(undefined)
                    }
                    invalid={fieldState.invalid}
                    disabled={field.disabled || !!payload?.user}
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
            form="form-roleuser-create"
            disabled={!form.formState.isValid || form.formState.isSubmitting}
          >
            Assign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { RoleUserCreateDialog };
export type { RoleUserCreateDialogPayload };
