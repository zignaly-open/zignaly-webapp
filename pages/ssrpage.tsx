import { Button } from '@mui/material';
import StyledButton from '../components/StyledButton';

const SSRPage = () => {
  return (
    <>
      <Button variant="contained" color="primary">
        Sup ssr bro
      </Button>
      <StyledButton />
    </>
  );
};

export const getServerSideProps = () => {
  return { props: {} };
};

export default SSRPage;
