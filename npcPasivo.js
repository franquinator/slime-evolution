class NpcPasivo extends Npc {
    update() {
        if (this.estaA_DistaciaDe_(this.radioDeEscape, this.juego.slime)) {
            this.huirDe(this.juego.slime);
        }
        else {
            this.deambular();
        }
        super.update();
    }
}