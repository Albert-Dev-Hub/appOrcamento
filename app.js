//Possui os valores Ids
class Despesa{
  constructor(ano,mes,dia,tipo,descricao,valor){
    this.ano = ano
    this.mes = mes
    this.dia = dia
    this.tipo = tipo
    this.descricao = descricao
    this.valor = valor
  }
  //Verificar se a informações (vazia,invalidas) no campo de preenchimento das despesas    
  validarDados(){
    for(let i in this ){
      if(this[i] == undefined || this[i] == '' || this[i] == null){
        return false
      }
   }
  return true
   }
}
//Verifica se há um Id no localStroge 
class Bd{
  constructor(){
    let id = localStorage.getItem('id')
    if(id === null){
      localStorage.setItem('id', 0)
    }
  }
  //Faz atribuições do Id inserido no localStroge
  getProximoId(){
    let proximoId = localStorage.getItem('id')
    return parseInt(proximoId)+1
  }
  //Grava os Ids no ocalStroge
    gravar(d){
    let id = this.getProximoId()
    localStorage.setItem(id,JSON.stringify(d))
    localStorage.setItem('id', id)
  }

    recuperarTodosRegistros(){
     //array de despesas
      let despesas = Array()

      let id = localStorage.getItem('id')
      
      //Recuperar todas as despesas casdastradas em localStorage
      for(let i = 1;i <= id; i++){

        //recuperar a despesa
        let despesa = JSON.parse(localStorage.getItem(i))

        //existe a possibilidade de haver indices q foram pulados/removidos.
        //neste caso os indices deve ser pulados 
        if(despesa === null){
          continue
        } 
        despesa.id = i
        despesas.push(despesa)
      }
      return despesas
    }
    pesquisar(despesa){
      let despesasFiltradas = Array()
      despesasFiltradas = this.recuperarTodosRegistros()
      
      //Ano
      if(despesa.ano != ''){
        despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano) 
      }
      //Mes
      if(despesa.mes != ''){
        despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes) 
      }
       //Dia
       if(despesa.dia != ''){
        despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia) 
      }
       //Tipo
       if(despesa.tipo != ''){
        despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo) 
      }
       //Descrição
       if(despesa.descricao != ''){
        despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao) 
      }
       //Valor
       if(despesa.valor != ''){
        despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor) 
      }
        return despesasFiltradas
    }
      remover(id){
        localStorage.removeItem(id)
      }

  }
let bd = new Bd() 

//Seleciona os elementos através do seu Id
function cadastrarDespesa(){
 let ano = document.getElementById('ano')
 let mes = document.getElementById('mes')
 let dia = document.getElementById('dia')
 let tipo = document.getElementById('tipo')
 let descricao = document.getElementById('descricao')
 let valor =  document.getElementById('valor')

//Criação a Class Despesa e passa os valores dos Ids para ela
let despesa = new Despesa(
  ano.value,
  mes.value,
  dia.value,
  tipo.value,
  descricao.value,
  valor.value
  )
if(despesa.validarDados()){
  bd.gravar(despesa)
  
  document.getElementById('modal_titulo').innerHTML = "Registro inserido com sucesso"
  document.getElementById('modal_titulo_div').className = 'modal-header text-success'
  document.getElementById('modal_conteudo').innerHTML = "Despesa foi cadastrada com sucesso "
  document.getElementById('modal_btn').innerHTML = 'Voltar'
  document.getElementById('modal_btn').className = 'btn btn-success'

  $("#modalRegistraDespesa").modal('show')

 ano.value = ''
 mes.value = '' 
 dia.value = '' 
 tipo.value = ''
 tipo.value = ''
 descricao.value = ''
 valor.value = ''

}else{
 
document.getElementById('modal_titulo').innerHTML = "A dados obrigatorios que precisam ser inseridos"
document.getElementById('modal_titulo_div').className = 'modal-header text-danger'
document.getElementById('modal_conteudo').innerHTML = "Erro na gravação verifique se todos os campos foram preenchidos corretamente"
document.getElementById('modal_btn').innerHTML = 'Voltar e corrigir'
document.getElementById('modal_btn').className = 'btn btn-danger'

$('#modalRegistraDespesa').modal('show')
  } 
}

function carregaListaDespesas(despesas = Array(), filtro = false){
 
  if(despesas.length == 0 && filtro == false){
  despesas = bd.recuperarTodosRegistros()
}
  //seleção elemento tbody da tabela
   let listaDespesas = document.getElementById('listaDespesas')
   listaDespesas.innerHTML = ''

  //percorrer o array despesas, listando cada despesa de forma dinâmica
  despesas.forEach(function(d){
    
    //Criando linha (tr) 
   let linha = listaDespesas.insertRow()

    //criar as colunas(td)
    linha.insertCell(0).innerHTML = `${d.dia} /${d.mes}/${d.ano}` 
    //ajustar o tipo
    switch(d.tipo){
      case '1': d.tipo = 'Alimentação'
        break
      case '2': d.tipo = 'Educação'
        break
      case '3': d.tipo = 'Lazer'
        break    
      case '4': d.tipo = 'Saúde'
        break    
      case '5': d.tipo = 'Transporte'
        break    
        
    }
    linha.insertCell(1).innerHTML = d.tipo
    linha.insertCell(2).innerHTML = d.descricao
    linha.insertCell(3).innerHTML = d.valor
  
    //criar o botão de exclusão
  let btn = document.createElement('button')
  btn.className = 'btn btn-danger'
  btn.innerHTML = '<i class="fas fa-times"></i>'
  btn.id = `id-despesa${d.id}`
  btn.onclick = function(){
    let id = this.id.replace('id-despesa', '') 
    

    bd.remover(id)
    window.location.reload()
  }
  linha.insertCell(4).append(btn)
  console.log(d)  
})
}
function pesquisarDespesa(){
  let ano = document.getElementById('ano').value
  let mes = document.getElementById('mes').value
  let dia = document.getElementById('dia').value
  let tipo = document.getElementById('tipo').value
  let descricao = document.getElementById('descricao').value
  let valor = document.getElementById('valor').value

  let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

let  despesas = bd.pesquisar(despesa)

carregaListaDespesas(despesas, true)

}    

