/*
  --------------------------------------------------------------------------------------
  Função para obter a lista existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const getList = async () => {
  let url = 'http://127.0.0.1:5000/lista_apostas';
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      data.apostas.forEach(item=> insertList(item.id_jogo, item.id_player, item.placar1, item.placar2))
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Chamada da função para carregamento inicial dos dados
  --------------------------------------------------------------------------------------
*/

getList() 


/*
  --------------------------------------------------------------------------------------
  Função para colocar um item na lista do servidor via requisição POST
  --------------------------------------------------------------------------------------
*/
const postItem = async (inputPartida, inputJogador, inputPlacar1, inputPlacar2) => {
  const formData = new FormData();
  formData.append('id_jogo', inputPartida);
  formData.append('id_player', inputJogador);
  formData.append('placar1', inputPlacar1);
  formData.append('placar2', inputPlacar2);


  let url = 'http://127.0.0.1:5000/incluir_aposta';
  fetch(url, {
    method: 'post',
    body: formData
  }) 

  .then((response) => {
    if ( JSON.stringify(response.status) === "409" )
      {
        mensagem = 'O jogo "' + inputPartida + '" já tem aposta feita.'
        alertify.alert(mensagem)
      } 
    else 
      {
      insertList(inputPartida, inputJogador, inputPlacar1, inputPlacar2)
      alertify.alert("Boa sorte, sua aposta foi incluida com sucesso!") 
      }
    response.json
  })
  .catch((error) => {
      console.error('Error:', error);
  });

}


/*
  --------------------------------------------------------------------------------------
  Função para criar um botão close para cada item da lista
  --------------------------------------------------------------------------------------
*/
const insertButton = (parent) => {
  let span = document.createElement("span");
  let txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  parent.appendChild(span);
}

/*
  -------------------------------------------------------------------------------------
  Função para remover um item da lista de acordo com o click no botão close
  --------------------------------------------------------------------------------------
*/
const removeElement = () => {
  let close = document.getElementsByClassName("close");
  // var table = document.getElementById('myTable');
  let i;
  for (i = 0; i < close.length; i++) { 
    close[i].onclick = function () {
          
      let div = this.parentElement.parentElement;
      const id_jogoItem = div.getElementsByTagName('td')[0].innerHTML
      mensagem = 'Aposta ' +  id_jogoItem + ', Confirma remover?'
      alertify.confirm(mensagem, 
      function (e) {
        if (e){
          div.remove()
          deleteItem(id_jogoItem)
          alertify.success("Sua aposta foi removida com sucesso !!");
        }
        }
      );
    }
  }
}
  
/*
  --------------------------------------------------------------------------------------
  Função para deletar um item da lista do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/
const deleteItem = (item) => {
  console.log(item)
  let url = 'http://127.0.0.1:5000/excluir_aposta?id_jogo=' + item;
  fetch(url, {
    method: 'delete'
  })
///*
  .then((response) => response.json())
  .catch((error) => {
    console.error('Error:', error);
  });

}

/*
  --------------------------------------------------------------------------------------
  Função para adicionar um nova aposta 
  --------------------------------------------------------------------------------------
*/

const newAposta = () => {
  let inputPartida = document.getElementById("newPartida").value;
  let inputJogador = 'jogador99';
  let inputPlacar1 = document.getElementById("newPlacar1").value;
  let inputPlacar2 = document.getElementById("newPlacar2").value;

  if (inputPartida.length === 0) {
    alertify.alert("Por favor, selecione uma partida da rodada");
  } else
  if (isNaN(inputPlacar1) || isNaN(inputPlacar2)) {
      alertify.alert("Os dois placares precisam ser números!");
  } else 
  if (inputPlacar1.length === 0 || inputPlacar2.length === 0) {
    alertify.alert("Os dois placares precisam ser números!");  
  } else {
    postItem(inputPartida, inputJogador, inputPlacar1, inputPlacar2) 
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para inserir items na lista apresentada
  --------------------------------------------------------------------------------------
*/
const insertList = (namePartida, nameJogador, placar1, placar2) => {
  var item = [namePartida, nameJogador, placar1, placar2]
  var table = document.getElementById('myTable');
  var row = table.insertRow();

  for (var i = 0; i < item.length; i++) {
    var cel = row.insertCell(i);
    cel.textContent = item[i];
  }
  insertButton(row.insertCell(-1))
  document.getElementById("newPartida").value = "";
  document.getElementById("newJogador").value = "";
  document.getElementById("newPlacar1").value = "";
  document.getElementById("newPlacar2").value = "";

  removeElement()
}