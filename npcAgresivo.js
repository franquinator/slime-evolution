class NpcAgresivo extends Npc {
  update() {
    if (this.estaA_DistaciaDe_(this.radioDeEscape, this.juego.slime)) {
      if(this.radio > this.juego.slime.radio){
        this.perseguirA(this.juego.slime);
      }
      else{
        this.huirDe(this.juego.slime);
      }
    }
    else {
      this.deambular();
    }
    super.update();
  }
}
