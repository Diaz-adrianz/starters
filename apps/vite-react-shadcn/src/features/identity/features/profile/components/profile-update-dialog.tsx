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
  updateProfileSchema,
  type UpdateProfileValues,
} from '../schemas/profile.schema';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useUpdateProfile } from '../api/profile.mutation';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ProfileGenderOptions } from '../constants/profile.constant';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { RiCalendarLine } from '@remixicon/react';
import { formatDate } from '@/utils/date';
import { Calendar } from '@/components/ui/calendar';
import { useProfile } from '../api/profile.query';
import { LoadingOverlay } from '@/components/shared/loading';
import { NotFoundResourceEmpty } from '@/components/shared/not-found-empty';

type ProfileUpdateDialogPayload = { id: string };

function ProfileUpdateDialog({
  open,
  onOpenChange,
  hide,
  payload,
  onSuccess,
}: DialogState<ProfileUpdateDialogPayload> & {
  onSuccess?: () => void;
}) {
  const { data, isLoading } = useProfile(payload?.id ?? '', {
      enabled: !!payload?.id && open,
    }),
    updateApi = useUpdateProfile({
      onSuccess() {
        hide();
        onSuccess?.();
      },
    });

  const form = useForm<UpdateProfileValues>({
    resolver: yupResolver(updateProfileSchema),
    mode: 'onChange',
    defaultValues: {},
    values: data && {
      ...data,
      firstName: data.firstName ?? '',
      lastName: data.lastName ?? '',
    },
  });

  const update = (values: UpdateProfileValues) => {
    if (data)
      toast.promise(updateApi.mutateAsync({ id: data.id, values }), {
        loading: 'Editing profile...',
        success: 'Profile edited',
      });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        {isLoading && <LoadingOverlay />}

        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        {!data && !isLoading && open ? (
          <NotFoundResourceEmpty resource="Profile" />
        ) : (
          <>
            <form
              id="form-profile-update"
              onSubmit={form.handleSubmit(update)}
              className="-mx-4 no-scrollbar max-h-[80vh] overflow-y-auto px-4 pb-2"
            >
              <FieldGroup>
                <div className="grid grid-cols-2 gap-4">
                  <Controller
                    name="firstName"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="firstName">First name</FieldLabel>
                        <Input
                          {...field}
                          id="firstName"
                          placeholder="John"
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="lastName"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="lastName">Last name</FieldLabel>
                        <Input
                          {...field}
                          id="lastName"
                          placeholder="Doe"
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>
                <Controller
                  name="dateOfBirth"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="dateOfBirth">
                        Date of birth
                      </FieldLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="justify-start font-normal"
                          >
                            <RiCalendarLine />
                            {field.value ? (
                              formatDate(field.value, 'dd MMM yyyy')
                            ) : (
                              <span>Select date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value ?? undefined}
                            onSelect={field.onChange}
                            defaultMonth={field.value ?? undefined}
                          />
                        </PopoverContent>
                      </Popover>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="gender"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="gender">Gender</FieldLabel>
                      <Select
                        name={field.name}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          id="gender"
                          aria-invalid={fieldState.invalid}
                        >
                          <SelectValue placeholder="Choose" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem
                            value={''}
                            className="text-muted-foreground"
                          >
                            Clear selection
                          </SelectItem>
                          {ProfileGenderOptions.map((o) => (
                            <SelectItem key={o.value} value={o.value}>
                              {o.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="phoneNumber"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="phoneNumber">
                        Phone number
                      </FieldLabel>
                      <Input
                        {...field}
                        type="tel"
                        id="phoneNumber"
                        placeholder="+6281234567890"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="bio"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="bio">Bio</FieldLabel>
                      <Textarea
                        {...field}
                        id="bio"
                        placeholder="Tell us a little about yourself"
                        aria-invalid={fieldState.invalid}
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
                form="form-profile-update"
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

export { ProfileUpdateDialog };
export type { ProfileUpdateDialogPayload };
