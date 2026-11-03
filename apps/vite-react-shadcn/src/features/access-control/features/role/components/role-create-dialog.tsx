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
  createRoleSchema,
  type CreateRoleValues,
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
import { useCreateRole } from '../api/role.mutation';
import { toast } from 'sonner';

function RoleCreateDialog({ open, onOpenChange, hide }: DialogState) {
  const form = useForm<CreateRoleValues>({
    resolver: yupResolver(createRoleSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      enabled: true,
    },
  });

  const createApi = useCreateRole({
    onSuccess() {
      hide();
      form.reset();
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

        <form
          id="form-role-create"
          onSubmit={form.handleSubmit(create)}
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
            form="form-role-create"
            disabled={!form.formState.isValid || form.formState.isSubmitting}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { RoleCreateDialog };
