import type { DialogState } from '@/hooks/use-dialog';
import {
  RoleCombobox,
  type RoleComboboxItem,
} from '../../role/components/role-combobox';
import {
  PermissionCombobox,
  type PermissionComboboxItem,
} from '@/features/access-control';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useEffect, useState } from 'react';
import {
  createRolePermissionSchema,
  type CreateRolePermissionValues,
} from '../schemas/role-permission.schema';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCreateRolePermission } from '../api/role-permission.mutation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RiAlarmWarningLine } from '@remixicon/react';

type RolePermissionCreateDialogPayload = {
  role?: RoleComboboxItem;
  permission?: PermissionComboboxItem;
};

function RolePermissionCreateDialog({
  open,
  onOpenChange,
  hide,
  payload,
}: DialogState<RolePermissionCreateDialogPayload>) {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  const form = useForm<CreateRolePermissionValues>({
    resolver: yupResolver(createRolePermissionSchema),
    mode: 'onChange',
    defaultValues: { role: undefined, permission: undefined },
  });

  useEffect(() => {
    if (open)
      form.reset({ role: payload?.role, permission: payload?.permission });
  }, [open, payload]);

  const createApi = useCreateRolePermission({
    onSuccess() {
      hide();
      form.reset();
    },
  });

  const create = (values: CreateRolePermissionValues) => {
    let condition = null;
    if (values.condition)
      try {
        condition = JSON.parse(values.condition);
      } catch {
        form.setError('condition', { message: 'JSON invalid' });
        return;
      }

    toast.promise(
      createApi.mutateAsync({
        roleId: values.role.id,
        permissionId: values.permission.id,
        condition,
      }),
      { loading: 'Granting permission...', success: 'Permission granted' }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent ref={setContainer}>
        <DialogHeader>
          <DialogTitle>Grant Permission</DialogTitle>
        </DialogHeader>

        <form
          id="form-rolepermission-create"
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
              name="permission"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Permission</FieldLabel>
                  <PermissionCombobox
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
                    disabled={field.disabled || !!payload?.permission}
                    onBlur={field.onBlur}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="condition"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Condition</FieldLabel>
                  <Alert variant="destructive">
                    <RiAlarmWarningLine />
                    <AlertTitle>This field controls access</AlertTitle>
                    <AlertDescription>
                      The condition decides what users with this role can
                      access. A mistake here can grant or block access
                      unexpectedly. Double-check the JSON before saving.
                    </AlertDescription>
                  </Alert>
                  <Textarea
                    {...field}
                    value={field.value ?? ''}
                    id={field.name}
                    placeholder="{ userId: { eq: '{{actor.id}}' } }"
                    aria-invalid={fieldState.invalid}
                    className="font-mono"
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
            form="form-rolepermission-create"
            disabled={!form.formState.isValid || form.formState.isSubmitting}
          >
            Grant
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { RolePermissionCreateDialog };
export type { RolePermissionCreateDialogPayload };
