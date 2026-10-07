import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [pessoas, setPessoas] = useState([]);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [numero_cpf, setNumeroCpf] = useState("");

  // GET - buscar pessoas
  const buscarPessoas = async () => {
    const resposta = await fetch("http://localhost:3000/pessoas");
    const dados = await resposta.json();

    setPessoas(dados);
  };

  // POST - cadastrar pessoa
  const cadastrarPessoa = async (e) => {
    e.preventDefault();

    const resposta = await fetch("http://localhost:3000/pessoas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        nome,
        email,
        numero_cpf
      })
    });

    const dados = await resposta.json();

    console.log(dados);

    setNome("");
    setEmail("");
    setNumeroCpf("");

    buscarPessoas();
  };

  // DELETE - excluir pessoa
  const excluirPessoa = async (id) => {
    await fetch(`http://localhost:3000/pessoas/${id}`, {
      method: "DELETE"
    });

    buscarPessoas();
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
        />

        <label>E-mail</label>

        <input
          type="email"
          placeholder="Digite o e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>CPF</label>

        <input
          type="text"
          placeholder="Digite o CPF"
          value={numero_cpf}
          onChange={(e) => setNumeroCpf(e.target.value)}
        />

        <button type="submit">
          Cadastrar
        </button>

      </form>

      <h2>Pessoas cadastradas</h2>

      <div className="pessoas">

        {pessoas.map((pessoa) => (

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

            <button
              className="botao-excluir"
              onClick={() => excluirPessoa(pessoa.id)}
            >
              Excluir
            </button>

          </div>

        ))}

      </div>

    </div>
  );
}

export default App;