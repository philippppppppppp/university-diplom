import { EstateForm } from "../../entities/estate";
import { Layout } from "../../shared/ui";
import { Header } from "../../widgets/header";

export const CreateEstatePage: React.FC = () => {
  return (
    <>
      <Header />
      <Layout>
        <EstateForm />
      </Layout>
    </>
  );
};
