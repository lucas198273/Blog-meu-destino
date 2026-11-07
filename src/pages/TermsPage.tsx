import { Helmet } from 'react-helmet-async';
import { Container } from '../components/ui/Container';
import { canonicalUrl } from '../lib/seo';

export function TermsPage() {
  return (
    <>
      <Helmet>
        <title>Termos de Uso | Meu Destino</title>
        <meta
          name="description"
          content=" Leia os Termos de Uso do Meu Destino, guia independente de viagens e recomendações."
        />
        <link rel="canonical" href={canonicalUrl('/termos-de-uso')} />
      </Helmet>

      <Container className="py-12 sm:py-16">
        <article className="prose prose-slate mx-auto max-w-3xl">
          <h1>Termos de Uso</h1>
          <p>
            Bem-vindo ao Meu Destino. Ao acessar e utilizar este site, você
            concorda com os presentes Termos de Uso. Leia-os atentamente.
          </p>

          <h2>1. Natureza do Serviço</h2>
          <p>
            O Meu Destino é um <strong>guia de viagens e vitrine de recomendações</strong>.
            Nossa plataforma conecta usuários a produtos e serviços de terceiros
            (nossos parceiros), como pacotes de viagens, aluguel de veículos e
            equipamentos.
          </p>

          <h2>2. Isenção de Responsabilidade e Transações</h2>
          <p>
            Nós <strong>não vendemos produtos diretamente</strong>. Ao clicar em
            uma oferta, você será redirecionado para o site oficial do nosso
            parceiro (ex: agências de viagem, locadoras, lojas online).
          </p>
          <p>
            A compra, pagamento, entrega, garantia e suporte são de
            responsabilidade exclusiva do parceiro. O Meu Destino não se
            responsabiliza por problemas decorrentes da relação comercial entre
            você e o parceiro.
          </p>

          <h2>3. Propriedade Intelectual</h2>
          <p>
            Todo o conteúdo deste site (textos, artigos, logotipos e design) é de
            propriedade do Meu Destino ou de seus licenciadores, sendo proibida a
            reprodução sem autorização prévia.
          </p>

          <h2>4. Modificações</h2>
          <p>
            Reservamo-nos o direito de alterar estes Termos a qualquer momento,
            sem aviso prévio. O uso contínuo do site após as alterações
            constitui sua aceitação.
          </p>
        </article>
      </Container>
    </>
  );
}
