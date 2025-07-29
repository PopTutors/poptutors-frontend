import { Helmet } from 'react-helmet-async';

type PageTitleProps = {
  title: string;
  description?: string;
};

const Head = ({ title, description }: PageTitleProps) => {
  return (
    <div>
      <Helmet>
        <title>{title} | Noir</title>
        {description && <meta name="description" content={description} />}
      </Helmet>
    </div>
  );
};

export default Head;
