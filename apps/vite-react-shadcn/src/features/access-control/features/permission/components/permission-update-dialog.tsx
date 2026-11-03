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
  updatePermissionSchema,
  type UpdatePermissionValues,
} from '../schemas/permission.schema';
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
import { useUpdatePermission } from '../api/permission.mutation';
import { toast } from 'sonner';
import { usePermission } from '../api/permission.query';
import { LoadingOverlay } from '@/components/shared/loading';
import { NotFoundResourceEmpty } from '@/components/shared/not-found-empty';

type PermissionUpdateDialogPayload = { id: string };

function PermissionUpdateDialog({
  open,
  onOpenChange,
  hide,
  payload,
}: DialogState<PermissionUpdateDialogPayload>) {
  const { data, isLoading } = usePermission(payload?.id ?? '', {
      enabled: !!payload?.id && open,
    }),
    updateApi = useUpdatePermission({
      onSuccess() {
        hide();
      },
    });

  const form = useForm<UpdatePermissionValues>({
    resolver: yupResolver(updatePermissionSchema),
    mode: 'onChange',
    defaultValues: { description: '', enabled: true },
    values: data && { description: data.description, enabled: data.enabled },
  });

  const update = (values: UpdatePermissionValues) => {
    if (data)
      toast.promise(updateApi.mutateAsync({ id: data.id, values }), {
        loading: 'Updating permission...',
        success: 'Permission updated',
      });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        {isLoading && <LoadingOverlay />}

        <DialogHeader>
          <DialogTitle>Update Permission</DialogTitle>
        </DialogHeader>

        {!data && !isLoading && open ? (
          <NotFoundResourceEmpty resource="Permission" />
        ) : (
          <>
            <form
              id="form-permission-update"
              onSubmit={form.handleSubmit(update)}
              className="-mx-4 no-scrollbar max-h-[80vh] overflow-y-auto px-4 pb-2"
            >
              <FieldGroup>
                <Controller
                  name="description"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Description</FieldLabel>
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
                form="form-permission-update"
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

export { PermissionUpdateDialog };
export type { PermissionUpdateDialogPayload };
