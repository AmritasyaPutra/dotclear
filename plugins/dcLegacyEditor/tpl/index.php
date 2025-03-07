<?php echo dcPage::breadcrumb([__('Plugins') => '', __('dcLegacyEditor') => '']) . dcPage::notices(); ?>

<?php if (dcCore::app()->admin->editor_is_admin): ?>
  <h3 class="hidden-if-js"><?php echo __('Settings'); ?></h3>
  <form action="<?php echo dcCore::app()->admin->getPageURL(); ?>" method="post" enctype="multipart/form-data">
    <div class="fieldset">
      <h3><?php echo __('Plugin activation'); ?></h3>
      <p>
        <label class="classic" for="dclegacyeditor_active">
          <?php echo form::checkbox('dclegacyeditor_active', 1, dcCore::app()->admin->editor_std_active); ?>
          <?php echo __('Enable dcLegacyEditor plugin'); ?>
        </label>
      </p>
    </div>

    <p>
    <input type="hidden" name="p" value="dcLegacyEditor"/>
    <?php echo dcCore::app()->formNonce(); ?>
    <input type="submit" name="saveconfig" value="<?php echo __('Save configuration'); ?>" />
    <input type="button" value="<?php echo  __('Cancel'); ?>" class="go-back reset hidden-if-no-js" />
    </p>
  </form>
<?php endif;?>

<?php dcPage::helpBlock('dcLegacyEditor');?>
