import { useNavigate } from "react-router-dom";
import { CreateEstateForm } from "../../entities/estate";
import { Layout } from "../../shared/ui";
import { Header } from "../../widgets/header";

export const CreateEstatePage: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = (id: string) => {
    navigate(`/estate/${id}`);
  };

  return (
    <>
      <Header />
      <Layout>
        <CreateEstateForm onSuccess={handleSuccess} />
      </Layout>
    </>
  );
};
