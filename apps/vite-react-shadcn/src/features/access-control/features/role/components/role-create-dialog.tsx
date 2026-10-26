import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { DialogState } from '@/hooks/use-dialog';
import { Controller, useForm } from 'react-hook-form';
import {
  createRoleSchema,
  type CreateRoleValues,
} from '../schemas/role.schema';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { useCreateRole } from '../api/role.mutation';
import { toast } from 'sonner';

function RoleCreateDialog({ open, onOpenChange, hide }: DialogState) {
  const createApi = useCreateRole({
    onSuccess() {
      hide();
    },
  });

  const form = useForm<CreateRoleValues>({
    resolver: zodResolver(createRoleSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      enabled: true,
    },
  });

  const create = (values: CreateRoleValues) => {
    toast.promise(createApi.mutateAsync(values), {
      loading: 'Creating role...',
      success: 'Role created',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Role</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(create)}>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="name">Name</FieldLabel>
                  <Input
                    {...field}
                    id="name"
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
                    <FieldLabel htmlFor="enabled">Enable</FieldLabel>
                    {fieldState.invalid && (
                      <FieldError errors={[{ message: 'kodea' }]} />
                    )}
                  </FieldContent>
                  <Switch
                    name={field.name}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    id="enabled"
                    aria-invalid={fieldState.invalid}
                  />
                </Field>
              )}
            />

            <Field orientation={'horizontal'}>
              <Button
                className="w-full"
                type="submit"
                disabled={
                  !form.formState.isValid || form.formState.isSubmitting
                }
              >
                Save
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export { RoleCreateDialog };
