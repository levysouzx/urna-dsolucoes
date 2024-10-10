import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Howl } from "howler";
import urna from "./assets/urna.mp3";
import teclas from "./assets/teclas.mp3";
type Candidato = {
  nome: string;
  foto: string;
};

type Candidatos = {
  [key: string]: Candidato;
};

const candidatos: Candidatos = {
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
  digitos: z.string().min(2).regex(/^\d+$/, "Digite 2 números, por favor."),
});

const Urna: React.FC = () => {
  const {
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(votoSchema),
  });

  const [digitos, setDigitos] = useState<string[]>([]);
  const [candidato, setCandidato] = useState<Candidato | null>(null);
  const [votoConfirmado, setVotoConfirmado] = useState(false); 

  useEffect(() => {
    if (digitos.length === 2) {
      const numero = digitos.join("") as keyof Candidatos;
      setCandidato(candidatos[numero] || null);
    }
  }, [digitos]);

  const adicionarDigito = (digito: string) => {
    if (digitos.length < 2) {
      const novosDigitos = [...digitos, digito];
      setDigitos(novosDigitos);
      setValue("digitos", novosDigitos.join(""));
      clearErrors("digitos");
    }
  };

  const corrigir = () => {
    setDigitos([]);
    setCandidato(null);
    setValue("digitos", "");
  };

  const confirmar = () => {
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
    src: [urna],
  });
  const digitando = new Howl({
    src: [teclas],
  });

  return (
    <div className="flex justify-center items-center h-screen bg-dsolucoes-500">
      <div className="flex space-x-4">
        <div className="bg-dsolucoes-300 p-4 rounded-lg w-96 h-96 flex flex-col">
          <h2 className="text-center font-bold">Linguagem de Programação</h2>
          <div className="border-2 border-black h-16 flex justify-center items-center mb-16 bg-dsolucoes-950">
            {digitos.map((d, i) => (
              <span key={i} className="text-2xl mx-1">
                {d}
              </span>
            ))}
          </div>
          {votoConfirmado ? ( 
            <p className="text-center text-black font-bold text-9xl">FIM</p>
          ) : (
            candidato ? (
              <div className="text-center ">
                <img
                  src={candidato.foto}
                  alt={candidato.nome}
                  className="w-16 h-16 mx-auto rounded-md object-cover"
                />
                <p>{candidato.nome}</p>
              </div>
            ) : (
              digitos.length === 2 && (
                <p className="text-center text-red-500">Voto nulo</p>
              )
            )
          )}
        </div>

        <form
          onSubmit={handleSubmit(confirmar)}
          className="bg-dsolucoes-950 p-4 rounded-lg w-96 h-96 flex flex-col"
        >
          <h1 className="text-center text-2xl mb-4 font-bold text-white">
            Dsolucoes
          </h1>
          <div className="grid grid-cols-3 gap-1">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"].map(
              (numero) => (
                <Button
                  key={numero}
                  onClick={() => {
                    adicionarDigito(numero);
                    digitando.play();
                  }}
                  className="p-4 bg-dsolucoes-400 text-white rounded text-lg"
                  type="button"
                >
                  {numero}
                </Button>
              )
            )}
          </div>
          {errors.digitos && (
            <Alert className="mt-2">{String(errors.digitos.message)}</Alert>
          )}
          <div className="flex mt-4 gap-2 justify-center">
            <Button
              className="bg-dsolucoes-50 border px-4 py-2 text-zinc-500"
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
              onClick={() => audio.play()}
            >
              Confirma
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Urna;
