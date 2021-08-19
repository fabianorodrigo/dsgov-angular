import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BaseComponent, InformacaoLicenca, Usuario } from '../../base';
import { ItemMenu } from '../item-menu.interface';
import {
  RegraExibicaoMenu,
  RegraExibicaoMenuType,
} from '../regra-exibicao-menu.enum';
import { TipoAgrupamentoMenu } from '../tipo-agrupamento-menu.enum';
import { GrupoItemMenu } from './../grupo-item-menu.interface';
import { LinkExternoMenu } from './../link-externo-menu.interface';

@Component({
  selector: 'br-menu',
  templateUrl: './menu.component.html',
  styles: [],
})
export class MenuComponent extends BaseComponent implements OnInit {
  //constantes usadas no template
  readonly SEMPRE = RegraExibicaoMenu.SEMPRE;
  readonly LOGADO = RegraExibicaoMenu.LOGADO;
  readonly NAO_LOGADO = RegraExibicaoMenu.NAO_LOGADO;
  readonly AGRUPAMENTO_EXPANSAO = TipoAgrupamentoMenu.EXPANSAO;
  readonly AGRUPAMENTO_ROTULO = TipoAgrupamentoMenu.ROTULO;
  readonly AGRUPAMENTO_DIVIDER = TipoAgrupamentoMenu.DIVIDER;

  // Tipo do agrupamento do menu
  @Input() tipoAgrupamentoMenu: TipoAgrupamentoMenu =
    TipoAgrupamentoMenu.EXPANSAO;

  // dados do usuario eventualmente logado
  @Input() usuario: Usuario;
  // evento disparado quando o menu é fechado
  @Output() closeMenu = new EventEmitter<any>();
  // lista de grupos de itens de menu
  @Input() grupos: GrupoItemMenu[];
  // url da imagem que aparece no menu
  @Input() urlImagem: string = 'assets/govbr-logo-large.png';
  //Links externos exibidos no menu, abaixo dos itens
  @Input() linksExternos: LinkExternoMenu[] = [];

  // Indica a exibição ou não da informação sobre licença no menu
  @Input() exibeInformacaoLicenca: boolean = true;
  // Label de apresentação e nome da licença utilizada
  @Input() informacaoLicenca: InformacaoLicenca = new InformacaoLicenca();

  // Pilha com IDs de side-menus (um menu com subitens de um item) ativos no momento
  // o ID da ponta da pilha é em exibição no momento. Ao fechar o side-menu, ocorre
  // um POP nesta pilha
  idSideMenuVisivel: string[] = [];

  constructor() {
    super();
  }

  ngOnInit() {
    // setando ids para os grupos e itens de menu
    // utilizado no controle de exibição/ocultação de side-menus
    this.grupos.forEach((g, i) => {
      this.setIDs([i.toString()], g.itens);
    });
  }

  private setIDs(idParents: string[], itens: ItemMenu[]) {
    itens.forEach((item, i) => {
      item.idParents = idParents;
      item.id = item.idParents[item.idParents.length - 1].concat(
        '_',
        i.toString()
      );
      if (item.subItens != null) {
        this.setIDs(item.idParents.concat(item.id), item.subItens);
        item.idChildren = item.subItens.map((si) => si.id);
      }
    });
  }

  onCloseMenu(event) {
    this.closeMenu.emit(event);
  }

  onMudancaExibicaoSideMenu(id: string) {
    // Se passar null, significa que está saindo de um side menu
    // remove então o último elemento (caso seja uma situação de
    // menus aninhados, voltará para o nível anterior)
    if (id == null) {
      this.idSideMenuVisivel.pop();
    }
    // passando um identificador, acrescenta id do side menu à pilha
    else {
      this.idSideMenuVisivel.push(id);
    }
  }
}
