
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [pessoas, setPessoas] = useState([]);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [numero_cpf, setNumeroCpf] = useState("");

  const [idEdicao, setIdEdicao] = useState(null);

  // GET - buscar pessoas
  const buscarPessoas = async () => {
    try {
      const resposta = await fetch("http://localhost:3000/pessoas");
      const dados = await resposta.json();
      setPessoas(dados);
    } catch (error) {
      console.error("Erro ao buscar pessoas:", error);
    }
  };

  // POST e PUT - cadastrar ou atualizar pessoa
  const cadastrarPessoa = async (e) => {
    e.preventDefault();

    const pessoa = {
      nome,
      email,
      numero_cpf
    };

    try {
      const url = idEdicao
        ? `http://localhost:3000/pessoas/${idEdicao}`
        : "http://localhost:3000/pessoas";

      const resposta = await fetch(url, {
        method: idEdicao ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(pessoa)
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        alert(dados.error || "Não foi possível salvar a pessoa.");
        return;
      }

      alert(
        idEdicao
          ? "Pessoa atualizada com sucesso!"
          : "Pessoa cadastrada com sucesso!"
      );

      limparFormulario();
      buscarPessoas();
    } catch (error) {
      console.error("Erro ao salvar pessoa:", error);
      alert("Não foi possível conectar ao servidor.");
    }
  };

  // Preencher formulário para editar
  const atualizarPessoa = (pessoa) => {
    setIdEdicao(pessoa.id);
    setNome(pessoa.nome);
    setEmail(pessoa.email);
    setNumeroCpf(
      pessoa.cpf ? pessoa.cpf.numero_cpf : ""
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // Limpar formulário
  const limparFormulario = () => {
    setNome("");
    setEmail("");
    setNumeroCpf("");
    setIdEdicao(null);
  };

  // DELETE - excluir pessoa
  const excluirPessoa = async (id) => {
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir esta pessoa?"
    );

    if (!confirmar) {
      return;
    }

    try {
      const resposta = await fetch(
        `http://localhost:3000/pessoas/${id}`,
        {
          method: "DELETE"
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        alert(dados.error || "Não foi possível excluir a pessoa.");
        return;
      }

      if (idEdicao === id) {
        limparFormulario();
      }

      alert("Pessoa excluída com sucesso!");
      buscarPessoas();
    } catch (error) {
      console.error("Erro ao excluir pessoa:", error);
      alert("Não foi possível conectar ao servidor.");
    }
  };

  // GET executado quando a página abre
  useEffect(() => {
    buscarPessoas();
  }, []);

  return (
    <div className="container">
      <h1>Cadastro de Pessoas</h1>

      <form onSubmit={cadastrarPessoa} className="formulario">
        <label>Nome</label>

        <input
          type="text"
          placeholder="Digite o nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />

        <label>E-mail</label>

        <input
          type="email"
          placeholder="Digite o e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>CPF</label>

        <input
          type="text"
          placeholder="Digite o CPF"
          value={numero_cpf}
          onChange={(e) => setNumeroCpf(e.target.value)}
          required
        />

        <button type="submit">
          {idEdicao ? "Salvar alterações" : "Cadastrar"}
        </button>

        {idEdicao !== null && (
          <button
            type="button"
            onClick={limparFormulario}
          >
            Cancelar edição
          </button>
        )}
      </form>

      <h2>Pessoas cadastradas</h2>

      <div className="pessoas">
        {pessoas.length === 0 ? (
          <p>Nenhuma pessoa cadastrada.</p>
        ) : (
          pessoas.map((pessoa) => (
            <div className="pessoa" key={pessoa.id}>
              <div className="dados-pessoa">
                <h3>{pessoa.nome}</h3>

                <p>
                  <strong>ID:</strong> {pessoa.id}
                </p>

                <p>
                  <strong>E-mail:</strong> {pessoa.email}
                </p>

                <p>
                  <strong>CPF:</strong>{" "}
                  {pessoa.cpf
                    ? pessoa.cpf.numero_cpf
                    : "Sem CPF"}
                </p>
              </div>

              <div className="botoes-pessoa">
                <button
                  className="botao-atualizar"
                  onClick={() => atualizarPessoa(pessoa)}
                >
                  Atualizar
                </button>

                <button
                  className="botao-excluir"
                  onClick={() => excluirPessoa(pessoa.id)}
                >
                  Excluir
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
