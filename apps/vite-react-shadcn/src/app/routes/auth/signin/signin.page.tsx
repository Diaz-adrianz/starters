import { Card, CardContent } from '@/components/ui/card';
import { SignInForm } from '@/features/auth';

const SignInPage = () => {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent>
          <SignInForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default SignInPage;
