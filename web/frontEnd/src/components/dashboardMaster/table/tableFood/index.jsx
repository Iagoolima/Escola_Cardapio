
import { MdDelete } from 'react-icons/md';
import Modal from 'react-modal';

import Api from "../../../../api";
import React, { useState, useEffect } from "react";

export default function TableFood() {

    const [foodsDay, setFoodsDay] = useState([]);

    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showAlert, setShowAlert] = useState(false);


    //rota para consultar os itens da tabela de café da manha e exibir
    const fetchFoodsDay = () => {
        Api.get('/tablefoodday')
            .then(response => {
                setFoodsDay(response.data);
                console.log(foodsDay)
            })
            .catch(error => {
                console.error('Erro ao obter os itens do banco de dados', error);
            });
    };

    useEffect(() => {
        const intervalId = setInterval(fetchFoodsDay, 2000); // Atualiza a tabela a cada 2 segundos

        return () => {
            clearInterval(intervalId); // Limpa o temporizador ao desmontar o componente
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    //deletar a tabela do dia onde os usuarios visualiza os alimento para votar
    function deleteTable() {
        Api.delete('/deletetablefood')
            .then(() => {
                console.log('Tabela do almoço excluída com sucesso');
                setFoodsDay([]);
            })
            .catch(error => {
                console.error('Erro ao excluir tabela do almoço', error);
            });

        //deletar a tabela de resultado da votação
        Api.delete('/deleteresultsfooduser')
            .then(() => {
                console.log('apagando tabela do usuario')
            }).catch(error => {
                console.error('Erro ao excluir tabela do almoço', error);
            });

        setShowConfirmation(false);
    }

    return (
        
        <div className="container-table">
            <h1 className="titleName-table">Almoço</h1>
            <div className="boxContent-table">
                {foodsDay.length === 0 ? (
                    <p className='EmptyText'>Tabela vazia, os alunos não tem opção para votarem</p>
                ) : (
                    foodsDay.map(food => (
                        <div key={food.id} className="coffe-item">
                            <p>{food.food}</p>
                        </div>
                    ))
                )}
            </div>

            <button type="button" className="buttonDelete" onClick={() => {
                if (foodsDay.length === 0) {
                    setShowAlert(true);
                } else {
                    setShowConfirmation(true);
                }
            }}>
                Excluir tabela <MdDelete size={25} />
            </button>

            <Modal isOpen={showAlert} onRequestClose={() => setShowAlert(false)} className="custom-modal alert">
                <div className="boxModalAlert ">
                    <h1>Atenção</h1>
                    <p>Tabela vazia, preencha ao lado</p>
                    <button onClick={() => setShowAlert(false)} className='buttonCancel-modal'>Fechar</button>
                </div>
            </Modal>

            <Modal isOpen={showConfirmation} onRequestClose={() => setShowConfirmation(false)} className="custom-modal confirm">
                <div className="boxModalAlert">
                    <h1>Confirmar ação</h1>
                    <p>Essa tabela será excluída e não poderá mais ser votada pelos alunos.</p>
                    <button onClick={deleteTable} className='buttonConfirm-modal'>Confirmar</button>
                    <button onClick={() => setShowConfirmation(false)} className='buttonCancel-modal'>Cancelar</button>
                </div>
            </Modal>
        </div>

    );
}

//componete que exibe a tabela do dia no lado direito da tela