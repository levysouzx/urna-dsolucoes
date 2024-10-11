import React, { useEffect, useState } from "react";
import "./index.css";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Howl } from "howler";
import urna from "./assets/urna.mp3";
import teclas from "./assets/teclas.mp3";
////////////////////////////////////////////////////////////////////////////by: Levy Sousa
type Candidato = {
  // type dos  dados que serão enviados

  nome: string;
  foto: string;
};

type Candidatos = {
  //define o objt

  [key: string]: Candidato;
};

const candidatos: Candidatos = {
  //   define todos os candidatos com nome, foto e o número dele
  "11": {
    nome: "Java",
    foto: "https://ensinado.com.br/wp-content/uploads/2021/06/java_logo_640.jpg",
  },
  "22": {
    nome: "TypeScript",
    foto: "https://www.datocms-assets.com/48401/1628645197-learn-typescript.png",
  },
  "33": {
    nome: "JavaScript",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Unofficial_JavaScript_logo_2.svg/800px-Unofficial_JavaScript_logo_2.svg.png",
  },
  "44": {
    nome: "Python",
    foto: "https://i0.wp.com/junilearning.com/wp-content/uploads/2020/06/python-programming-language.webp?fit=1920%2C1920&ssl=1",
  },
  "55": {
    nome: "Portugol",
    foto: "https://davidcreator.com/wp-content/uploads/2024/02/Portugol-Estrutura-Basica-de-um-Programa.jpg",
  },
  "66": {
    nome: "C",
    foto: "https://media.licdn.com/dms/image/D4D12AQFTyjg6Hc8-SQ/article-cover_image-shrink_600_2000/0/1696979699826?e=2147483647&v=beta&t=ljICSUVi8xvXy9wCqNuuvymgEvVp5kjaizNO1cYgJUg",
  },
  "77": {
    nome: "Vue",
    foto: "https://miro.medium.com/v2/resize:fit:900/1*OrjCKmou1jT4It5so5gvOA.jpeg",
  },
  "88": {
    nome: "Php",
    foto: "https://kinsta.com/pt/wp-content/uploads/sites/3/2019/05/PHP_Feature-Image-1024x536.jpg",
  },
  "99": {
    nome: "Fluter",
    foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWiWY0E_du9TYa4Nd-XDhDJNjUrU6r6h31JQ&s",
  },
};

const votoSchema = z.object({
  //validaçao do formulário com o  zod
  digitos: z.string().min(2).regex(/^\d+$/, "Digite 2 números, por favor."),
});

const Urna: React.FC = () => {
  const {
    // isso aqui é os ngc pra lidar com formulário usando o schema do zod
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(votoSchema),
  });

  const [digitos, setDigitos] = useState<string[]>([]); // amazena os digito
  const [candidato, setCandidato] = useState<Candidato | null>(null); //armazena o candidato escolhido
  const [votoConfirmado, setVotoConfirmado] = useState(false); // controla o ngc se foi confirmado ou não

  useEffect(() => {
    //verifica se foi escolhido os dois digitos
    if (digitos.length === 2) {
      const numero = digitos.join("") as keyof Candidatos;
      setCandidato(candidatos[numero] || null);
    }
  }, [digitos]);

  const adicionarDigito = (digito: string) => {
    //adiciona o digito a urna, mas só com os 2 números lá
    if (digitos.length < 2) {
      const novosDigitos = [...digitos, digito];
      setDigitos(novosDigitos);
      setValue("digitos", novosDigitos.join(""));
      clearErrors("digitos");
    }
  };

  const corrigir = () => {
    // limpa tudo
    setDigitos([]);
    setCandidato(null);
    setValue("digitos", "");
  };

  const confirmar = () => {
    //confirma o voto
    if (candidato) {
      localStorage.setItem("voto", JSON.stringify(candidato));
      alert(`Voto confirmado para ${candidato.nome}`);
      setVotoConfirmado(true);
      corrigir();
      return;
    }
    alert("Voto nulo");
  };

  const audio = new Howl({
    //para tocar o áudio quando apertar o botão de confirmar
    src: [urna],
  });
  const digitando = new Howl({
    // para tocar quando clicar nos número de 1 a 0
    src: [teclas],
  });

  return (
    <div className="flex flex-col md:flex-row justify-center items-center h-screen bg-dsolucoes-500 p-4">
      <div className="bg-dsolucoes-300 p-4 rounded-lg w-full max-w-md h-96 flex flex-col mb-4 md:mb-0 md:mr-4">
        <h2 className="text-center font-bold">Linguagem de Programação</h2>
        <div className="border-2 border-black h-16 flex justify-center items-center mb-16 bg-dsolucoes-950">
          {digitos.map(
            (
              d,
              i // vai iterar o array e renderizar o span
            ) => (
              <span key={i} className="text-2xl mx-1">
                {d}
              </span>
            )
          )}
        </div>
        {votoConfirmado ? (
          <p className="text-center text-black font-bold text-9xl">FIM</p>
        ) : candidato ? ( //quando acabar de votar aparecer essa mensagem de fim, assim como na urna de eleição
          <div className="text-center">
            <img
              src={candidato.foto}
              alt={candidato.nome}
              className="w-16 h-16 mx-auto rounded-md object-cover"
            />
            <p>{candidato.nome}</p>
          </div> //vai mostrar a foto do candidato e o nome dele
        ) : (
          digitos.length === 2 && (
            <p className="text-center text-red-500">Voto nulo</p>
          )
        )}
      </div>

      <form //vai ocorrer toda aquela validação do começo do código neste lugarzinho
        onSubmit={handleSubmit(confirmar)}
        className="bg-dsolucoes-950 p-4 rounded-lg w-full max-w-md h-96 flex flex-col"
      >
        <h1 className="text-center text-2xl mb-4 font-bold text-white">
          Dsolucoes
        </h1>
        <div className="grid grid-cols-3 gap-1">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"].map((numero) => (
            <Button
              key={numero}
              onClick={() => {
                adicionarDigito(numero);
                digitando.play(); //ao clicar vai tocar o audio de teclas
              }}
              className="p-4 bg-dsolucoes-400 text-white rounded text-lg"
              type="button"
            >
              {numero}
            </Button> //ao clicar esses bico aqui  vai adicionar o número no campo de digitação
          ))}
        </div>
        {errors.digitos && (
          <Alert className="mt-2">{String(errors.digitos.message)}</Alert>
        )}
        <div className="flex mt-4 gap-2 justify-center">
          <Button
            className="bg-dsolucoes-50 border px-4 py-2 "
            type="button"
            onClick={() => alert("Voto em Branco")}
          >
            Branco
          </Button>
          <Button
            className="bg-dsolucoes-400 text-white px-4 py-2"
            type="button"
            onClick={corrigir}
          >
            Corrige
          </Button>
          <Button
            className="bg-dsolucoes-600 text-white px-4 py-2"
            type="submit"
            onClick={() => audio.play()} //vai tocar a música quando apertar o botão de confirmar
          >
            Confirma
          </Button>
        </div>
      </form>
    </div> //fim e o form vai ter o botao e a validação pra confirmar, corrigir e branco
  );
};

export default Urna;
