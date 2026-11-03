import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { DialogState } from '@/hooks/use-dialog';
import { Controller, useForm } from 'react-hook-form';
import {
  updateRoleSchema,
  type UpdateRoleValues,
} from '../schemas/role.schema';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useUpdateRole } from '../api/role.mutation';
import { toast } from 'sonner';
import { useRole } from '../api/role.query';
import { LoadingOverlay } from '@/components/shared/loading';
import { NotFoundResourceEmpty } from '@/components/shared/not-found-empty';

type RoleUpdateDialogPayload = { id: string };

function RoleUpdateDialog({
  open,
  onOpenChange,
  hide,
  payload,
}: DialogState<RoleUpdateDialogPayload>) {
  const { data, isLoading } = useRole(payload?.id ?? '', {
      enabled: !!payload?.id && open,
    }),
    updateApi = useUpdateRole({
      onSuccess() {
        hide();
      },
    });

  const form = useForm<UpdateRoleValues>({
    resolver: yupResolver(updateRoleSchema),
    mode: 'onChange',
    defaultValues: { name: '', enabled: true },
    values: data && { name: data.name, enabled: data.enabled },
  });

  const update = (values: UpdateRoleValues) => {
    if (data)
      toast.promise(updateApi.mutateAsync({ id: data.id, values }), {
        loading: 'Updating role...',
        success: 'Role updated',
      });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        {isLoading && <LoadingOverlay />}

        <DialogHeader>
          <DialogTitle>Update Role</DialogTitle>
        </DialogHeader>

        {!data && !isLoading && open ? (
          <NotFoundResourceEmpty resource="Role" />
        ) : (
          <>
            <form
              id="form-role-update"
              onSubmit={form.handleSubmit(update)}
              className="-mx-4 no-scrollbar max-h-[80vh] overflow-y-auto px-4 pb-2"
            >
              <FieldGroup>
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="enabled"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field
                      orientation="horizontal"
                      data-invalid={fieldState.invalid}
                    >
                      <FieldContent>
                        <FieldLabel htmlFor={field.name}>Enable</FieldLabel>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </FieldContent>
                      <Switch
                        name={field.name}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                      />
                    </Field>
                  )}
                />
              </FieldGroup>
            </form>

            <DialogFooter>
              <Button
                className="w-full"
                type="submit"
                form="form-role-update"
                disabled={
                  !form.formState.isValid || form.formState.isSubmitting
                }
              >
                Save
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export { RoleUpdateDialog };
export type { RoleUpdateDialogPayload };
