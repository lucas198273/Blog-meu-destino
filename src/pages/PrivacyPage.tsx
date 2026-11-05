import { Helmet } from 'react-helmet-async';
import { Container } from '../components/ui/Container';
import { canonicalUrl } from '../lib/seo';

export function PrivacyPage() {
  return (
    <>
      <Helmet>
        <title>Política de Privacidade | Meu Destino</title>
        <meta
          name="description"
          content="Entenda como o Meu Destino lida com suas informações e dados de navegação."
        />
        <link
          rel="canonical"
          href={canonicalUrl('/politica-de-privacidade')}
        />
      </Helmet>

      <Container className="py-12 sm:py-16">
        <article className="prose prose-slate mx-auto max-w-3xl">
          <h1>Política de Privacidade</h1>
          <p>
            A sua privacidade é importante para nós. Esta política explica como
            o Meu Destino lida com suas informações.
          </p>

          <h2>1. Coleta de Dados Pessoais</h2>
          <p>
            O Meu Destino <strong>NÃO coleta dados pessoais sensíveis</strong>,
            como CPF, dados de cartão de crédito ou senhas. Nós não realizamos
            transações financeiras diretamente no site. Qualquer dado bancário é
            inserido apenas e exclusivamente nos sites dos nossos parceiros.
          </p>

          <h2>2. Uso de Cookies e Rastreamento</h2>
          <p>
            Nós utilizamos <strong>cookies</strong> e ferramentas de análise
            (como Google Analytics) para entender como os usuários navegam pelo
            site. Isso nos ajuda a melhorar a experiência de navegação e a
            apresentar conteúdos mais relevantes.
          </p>
          <p>
            Além disso, utilizamos cookies de rastreamento de afiliados. Isso
            significa que, se você clicar em um link de um parceiro, o parceiro
            saberá que você veio do Meu Destino. Isso não expõe seus dados
            pessoais, apenas garante a comissão da nossa plataforma.
          </p>

          <h2>3. Links para Sites de Terceiros</h2>
          <p>
            Nosso site contém links para sites externos (nossos parceiros). Não
            temos controle sobre a privacidade desses sites. Recomendamos que
            você leia as políticas de privacidade de cada parceiro antes de
            fornecer seus dados.
          </p>

          <h2>4. Seus Direitos</h2>
          <p>
            Como não armazenamos dados de cadastro, você pode navegar de forma
            anônima em nosso guia. Se tiver dúvidas, entre em contato pelo nosso
            e-mail de suporte.
          </p>
        </article>
      </Container>
    </>
  );
}
