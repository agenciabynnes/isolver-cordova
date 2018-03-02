<div class="modal-dialog" role="document">
    <div class="modal-content">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">x</span></button>
            <div class="section-title">
                <h2>Login</h2>
            </div>
        </div>
        <div class="modal-body">
            <form class="form inputs-underline" method="post">
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" class="form-control" name="email" id="email" placeholder="Digite seu email">
                </div>
                <!--end form-group-->
                <div class="form-group">
                    <label for="password">Senha</label>
                    <input type="password" class="form-control" name="password" id="password" placeholder="Digite sua senha">
                </div>
                <div class="form-group center">
                    <button type="submit" class="btn btn-primary width-100">Login</button>
                </div>
                <!--end form-group-->
            </form>
            <div class="form-group center">
                <button class="btn btn-success width-100">Cadastro</button>
            </div>
            <hr>

            <a href="#" data-modal-external-file="modal_reset_password.php" data-target="modal-reset-password">Esqueceu a senha?</a>
            <!--end form-->
        </div>
        <!--end modal-body-->
    </div>
    <!--end modal-content-->
</div>
<!--end modal-dialog-->