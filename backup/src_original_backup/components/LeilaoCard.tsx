import { FC } from 'react';
import { FaMapMarkerAlt, FaGavel } from 'react-icons/fa';
import { formatarMoeda } from '../utils/formatters';
import styles from './LeilaoCard.module.css';

interface LeilaoCardProps {
  titulo: string;
  descricao: string;
  valor: number;
  local: string;
  lances: number;
  status: 'aberto' | 'fechado';
  imagem: string;
}

export const LeilaoCard: FC<LeilaoCardProps> = ({
  titulo,
  descricao,
  valor,
  local,
  lances,
  status,
  imagem,
}) => {
  return (
    <div className={styles.card}>
      <img src={imagem} alt={titulo} className={styles.imagem} />
      <div className={styles.conteudo}>
        <h3 className={styles.titulo}>{titulo}</h3>
        <p className={styles.descricao}>{descricao}</p>
        <p className={styles.valor}>{formatarMoeda(valor)}</p>
        <p className={styles.local}>
          <FaMapMarkerAlt />
          {local}
        </p>
        <p className={styles.lances}>
          <FaGavel />
          {lances} lance{lances !== 1 ? 's' : ''}
        </p>
        <span className={`${styles.status} ${styles[`status${status.charAt(0).toUpperCase() + status.slice(1)}`]}`}>
          {status}
        </span>
      </div>
    </div>
  );
}; 