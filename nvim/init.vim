" init.vim
"



" Vim-plug

call plug#begin()
Plug 'tpope/vim-sensible'
Plug 'tpope/vim-obsession'
Plug 'itchyny/lightline.vim'
Plug 'neovimhaskell/haskell-vim'
Plug 'arcticicestudio/nord-vim'
call plug#end()

" haskell
let g:haskell_classic_highlighting = 0

" color
set termguicolors
colorscheme nord
au ColorScheme * hi Normal ctermbg=none guibg=none

" remove the mode name because I have lightline.vim
set noshowmode

" change lighline colors
let g:lightline ={
	\ 'colorscheme': 'nord',
	\}

" line number
set number
set rnu


" clipboard
set clipboard+=unnamedplus

" cursor style
set guicursor=n-v-sm:block,i-c-ci-ve:ver25,r-cr-o:hor20

" restore cursor when leave
:au VimLeave * set guicursor=a:hor20

" cursor line
set cursorline
set cursorcolumn
"hi CursorLine cterm=NONE ctermbg=grey guibg=green guifg=white




" template
autocmd BufNewFile *.py 0r ~/.config/nvim/template/python-temp
autocmd BufNewFile *.sh 0r ~/.config/nvim/template/shell-temp

" tab spaces
set tabstop=8 softtabstop=0 expandtab shiftwidth=4 smarttab

" syntax on
syntax on
filetype plugin indent on

" auto indent
set ai
