-- phpMyAdmin SQL Dump
-- version 4.0.10deb1
-- http://www.phpmyadmin.net
--
-- Servidor: localhost
-- Tempo de Geração: 17/08/2016 às 18:39
-- Versão do servidor: 5.5.50-0ubuntu0.14.04.1
-- Versão do PHP: 5.5.9-1ubuntu4.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Banco de dados: `db_ifms`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `tb_alunos`
--

CREATE TABLE IF NOT EXISTS `tb_alunos` (
  `ra` varchar(255) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `telefone` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `mac_address` varchar(255) NOT NULL,
  UNIQUE KEY `ra` (`ra`,`telefone`,`email`,`mac_address`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Tabela que contêm o registro de todos os dados dos alunos';

--
-- Fazendo dump de dados para tabela `tb_alunos`
--

INSERT INTO `tb_alunos` (`ra`, `nome`, `telefone`, `email`, `mac_address`) VALUES
('987', 'Marcus Bruno', '(67)991400703', 'marcusbrunogm@gmail.com', '02:02:02:02:02');

-- --------------------------------------------------------

--
-- Estrutura para tabela `tb_alunos_disciplinas`
--

CREATE TABLE IF NOT EXISTS `tb_alunos_disciplinas` (
  `codigo_ra` varchar(255) NOT NULL,
  `codigo_disciplina` varchar(255) NOT NULL,
  `data_inicio` date NOT NULL,
  `data_fim` date NOT NULL,
  UNIQUE KEY `codigo_ra` (`codigo_ra`,`codigo_disciplina`),
  KEY `codigo_disciplina` (`codigo_disciplina`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Tabela que contêm o registro do aluno nas disciplinas';

--
-- Fazendo dump de dados para tabela `tb_alunos_disciplinas`
--

INSERT INTO `tb_alunos_disciplinas` (`codigo_ra`, `codigo_disciplina`, `data_inicio`, `data_fim`) VALUES
('987', '001', '2016-08-01', '2016-08-31'),
('987', '002', '2016-08-01', '2016-08-31');

-- --------------------------------------------------------

--
-- Estrutura para tabela `tb_diario`
--

CREATE TABLE IF NOT EXISTS `tb_diario` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `rp` varchar(255) NOT NULL,
  `codigo_disciplina` varchar(255) NOT NULL,
  `horario_inicio` datetime DEFAULT NULL,
  `horario_fim` datetime DEFAULT NULL,
  `situacao` tinyint(1) NOT NULL,
  `latitude_professor` varchar(255) NOT NULL,
  `longitude_professor` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `horario_inicio` (`horario_inicio`,`horario_fim`,`id`,`rp`,`codigo_disciplina`),
  KEY `rp` (`rp`),
  KEY `codigo_disciplina` (`codigo_disciplina`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=35 ;

--
-- Fazendo dump de dados para tabela `tb_diario`
--

INSERT INTO `tb_diario` (`id`, `rp`, `codigo_disciplina`, `horario_inicio`, `horario_fim`, `situacao`, `latitude_professor`, `longitude_professor`) VALUES
(1, '123', '001', '2016-08-17 13:58:24', NULL, 1, '00001', '00001'),
(3, '123', '001', '2016-08-18 00:00:00', '2016-08-17 00:11:00', 1, '123123123', '123123123'),
(4, '123', '001', '2016-08-17 14:41:00', '2016-08-17 14:41:00', 1, '0001', '0002'),
(5, '123', '001', '2016-08-17 14:42:28', '0000-00-00 00:00:00', 1, '0001', '0002'),
(6, '123', '001', '2016-08-17 14:42:36', '0000-00-00 00:00:00', 1, '0001', '0002'),
(7, '123', '001', '2016-08-17 14:45:04', NULL, 1, '0001', '0002'),
(8, '123', '001', '2016-08-17 14:45:55', NULL, 1, '0001', '0002'),
(9, '123', '001', '2016-08-17 14:52:26', NULL, 1, '0001', '0002'),
(10, '123', '001', '2016-08-17 14:53:43', NULL, 1, '0001', '0002'),
(11, '123', '001', '2016-08-17 14:53:49', NULL, 1, '0001', '0002'),
(12, '123', '001', '2016-08-17 14:56:20', NULL, 1, '0001', '0002'),
(13, '123', '001', '2016-08-17 14:57:40', NULL, 1, '0001', '0002'),
(14, '123', '001', '2016-08-17 15:01:30', NULL, 1, '0001', '0002'),
(15, '123', '001', '2016-08-17 15:01:46', NULL, 1, '0001', '0002'),
(16, '123', '001', '2016-08-17 15:03:38', NULL, 1, '0001', '0002'),
(17, '123', '001', '2016-08-17 15:05:07', NULL, 1, '0001', '0002'),
(18, '123', '001', '2016-08-17 15:12:00', NULL, 1, '0001', '0002'),
(19, '123', '001', '2016-08-17 15:27:10', NULL, 1, '0001', '0002'),
(20, '123', '001', '2016-08-17 15:27:24', NULL, 1, '0001', '0002'),
(21, '123', '001', '2016-08-17 16:23:13', NULL, 1, '0001', '0002'),
(22, '123', '001', '2016-08-17 16:29:56', NULL, 1, '0001', '0002'),
(23, '123', '001', '2016-08-17 17:04:05', NULL, 1, '0001', '0002'),
(24, '123', '001', '2016-08-17 17:05:32', NULL, 1, '0001', '0002'),
(25, '123', '001', '2016-08-17 17:08:29', NULL, 1, '0001', '0002'),
(26, '123', '001', '2016-08-17 17:09:26', '2016-08-17 17:09:26', 1, '0001', '0002'),
(27, '123', '001', '2016-08-17 17:09:54', '2016-08-17 17:09:54', 1, '0001', '0002'),
(28, '123', '001', '2016-08-17 17:11:06', '2016-08-17 17:11:06', 1, '0001', '0002'),
(29, '123', '001', '2016-08-17 17:13:48', '2016-08-17 17:13:48', 1, '0001', '0002'),
(30, '123', '001', '2016-08-17 17:06:11', '2016-08-17 17:16:11', 1, '0001', '0002'),
(31, '123', '001', '2016-08-17 17:07:43', '2016-08-17 17:17:43', 0, '0001', '0002'),
(32, '123', '001', '2016-08-17 17:15:05', '2016-08-17 17:15:29', 0, '0001', '0002'),
(33, '123', '001', '2016-08-17 17:16:51', NULL, 1, '0001', '0002'),
(34, '123', '001', '2016-08-17 17:20:47', '2016-08-17 17:20:49', 0, '0001', '0002');

-- --------------------------------------------------------

--
-- Estrutura para tabela `tb_disciplinas`
--

CREATE TABLE IF NOT EXISTS `tb_disciplinas` (
  `codigo` varchar(255) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `descricao` text NOT NULL,
  PRIMARY KEY (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Tabela que contêm os registros das disciplinas da instituição';

--
-- Fazendo dump de dados para tabela `tb_disciplinas`
--

INSERT INTO `tb_disciplinas` (`codigo`, `nome`, `descricao`) VALUES
('001', 'Banco de Dados', 'Lorem Ipsum é simplesmente uma simulação de texto da indústria tipográfica e de impressos, e vem sendo utilizado desde o século XVI, quando um impressor desconhecido pegou uma bandeja de tipos e os embaralhou para fazer um livro de modelos de tipos. Lorem Ipsum sobreviveu não só a cinco séculos, como também ao salto para a editoração eletrônica, permanecendo essencialmente inalterado. Se popularizou na década de 60, quando a Letraset lançou decalques contendo passagens de Lorem Ipsum, e mais recentemente quando passou a ser integrado a softwares de editoração eletrônica como Aldus PageMaker.'),
('002', 'Engenharia de Software 1', 'Lorem Ipsum é simplesmente uma simulação de texto da indústria tipográfica e de impressos, e vem sendo utilizado desde o século XVI, quando um impressor desconhecido pegou uma bandeja de tipos e os embaralhou para fazer um livro de modelos de tipos. Lorem Ipsum sobreviveu não só a cinco séculos, como também ao salto para a editoração eletrônica, permanecendo essencialmente inalterado. Se popularizou na década de 60, quando a Letraset lançou decalques contendo passagens de Lorem Ipsum, e mais recentemente quando passou a ser integrado a softwares de editoração eletrônica como Aldus PageMaker.'),
('003', 'Linguagem de Programação 1', 'Lorem Ipsum é simplesmente uma simulação de texto da indústria tipográfica e de impressos, e vem sendo utilizado desde o século XVI, quando um impressor desconhecido pegou uma bandeja de tipos e os embaralhou para fazer um livro de modelos de tipos. Lorem Ipsum sobreviveu não só a cinco séculos, como também ao salto para a editoração eletrônica, permanecendo essencialmente inalterado. Se popularizou na década de 60, quando a Letraset lançou decalques contendo passagens de Lorem Ipsum, e mais recentemente quando passou a ser integrado a softwares de editoração eletrônica como Aldus PageMaker.');

-- --------------------------------------------------------

--
-- Estrutura para tabela `tb_lista_frequencia`
--

CREATE TABLE IF NOT EXISTS `tb_lista_frequencia` (
  `id_diario` int(11) NOT NULL,
  `codigo_ra` varchar(255) NOT NULL,
  `codigo_rp` varchar(255) NOT NULL,
  `codigo_disciplina` varchar(255) NOT NULL,
  `data_hora` datetime NOT NULL,
  `latitude_aluno` varchar(255) NOT NULL,
  `longitude_aluno` varchar(255) NOT NULL,
  PRIMARY KEY (`id_diario`),
  UNIQUE KEY `codigo_ra` (`codigo_ra`,`codigo_rp`,`codigo_disciplina`,`data_hora`),
  KEY `codigo_rp` (`codigo_rp`),
  KEY `codigo_disciplina` (`codigo_disciplina`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Tabela que contêm os registros das presenças dos alunos';

-- --------------------------------------------------------

--
-- Estrutura para tabela `tb_professores`
--

CREATE TABLE IF NOT EXISTS `tb_professores` (
  `rp` varchar(255) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `telefone` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `mac_address` varchar(255) NOT NULL,
  UNIQUE KEY `rp` (`rp`,`telefone`,`email`,`mac_address`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Tabela que contêm o registro dos dados dos professores';

--
-- Fazendo dump de dados para tabela `tb_professores`
--

INSERT INTO `tb_professores` (`rp`, `nome`, `telefone`, `email`, `mac_address`) VALUES
('123', 'GIlberto', '(67)99191-0091', 'gilberto.astolfi@ifms.edu.br', '01:01:01:01:01');

-- --------------------------------------------------------

--
-- Estrutura para tabela `tb_professores_disciplinas`
--

CREATE TABLE IF NOT EXISTS `tb_professores_disciplinas` (
  `codigo_rp` varchar(255) NOT NULL,
  `codigo_disciplina` varchar(255) NOT NULL,
  `data_inicio` date NOT NULL,
  `data_fim` date NOT NULL,
  UNIQUE KEY `codigo_rp` (`codigo_rp`,`codigo_disciplina`),
  KEY `codigo_disciplina` (`codigo_disciplina`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Tabela que atrela ao professor uma disciplina';

--
-- Fazendo dump de dados para tabela `tb_professores_disciplinas`
--

INSERT INTO `tb_professores_disciplinas` (`codigo_rp`, `codigo_disciplina`, `data_inicio`, `data_fim`) VALUES
('123', '001', '2016-08-01', '2016-08-31'),
('123', '002', '2016-08-01', '2016-08-31');

-- --------------------------------------------------------

--
-- Estrutura para tabela `tb_usuarios`
--

CREATE TABLE IF NOT EXISTS `tb_usuarios` (
  `id_usuario` int(11) NOT NULL AUTO_INCREMENT,
  `rp` varchar(255) NOT NULL,
  `ra` varchar(255) NOT NULL,
  `senha_usuario` varchar(255) NOT NULL,
  `tipo_usuario` varchar(255) NOT NULL,
  `situacao_usuario` varchar(255) NOT NULL,
  `ultimo_acesso` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `ra` (`ra`),
  UNIQUE KEY `rp` (`rp`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='Tabela que contêm os dados de acesso de todos os usuários' AUTO_INCREMENT=3 ;

--
-- Fazendo dump de dados para tabela `tb_usuarios`
--

INSERT INTO `tb_usuarios` (`id_usuario`, `rp`, `ra`, `senha_usuario`, `tipo_usuario`, `situacao_usuario`, `ultimo_acesso`) VALUES
(1, '123', '', '123', 'Professor', 'Ativo', '2016-08-12 17:27:13'),
(2, '', '987', '987', 'Aluno', 'Ativo', '2016-08-15 18:16:50');

--
-- Restrições para dumps de tabelas
--

--
-- Restrições para tabelas `tb_alunos`
--
ALTER TABLE `tb_alunos`
  ADD CONSTRAINT `tb_alunos_ibfk_1` FOREIGN KEY (`ra`) REFERENCES `tb_usuarios` (`ra`);

--
-- Restrições para tabelas `tb_alunos_disciplinas`
--
ALTER TABLE `tb_alunos_disciplinas`
  ADD CONSTRAINT `tb_alunos_disciplinas_ibfk_1` FOREIGN KEY (`codigo_ra`) REFERENCES `tb_usuarios` (`ra`),
  ADD CONSTRAINT `tb_alunos_disciplinas_ibfk_2` FOREIGN KEY (`codigo_disciplina`) REFERENCES `tb_disciplinas` (`codigo`);

--
-- Restrições para tabelas `tb_diario`
--
ALTER TABLE `tb_diario`
  ADD CONSTRAINT `tb_diario_ibfk_1` FOREIGN KEY (`rp`) REFERENCES `tb_professores` (`rp`),
  ADD CONSTRAINT `tb_diario_ibfk_2` FOREIGN KEY (`codigo_disciplina`) REFERENCES `tb_disciplinas` (`codigo`);

--
-- Restrições para tabelas `tb_lista_frequencia`
--
ALTER TABLE `tb_lista_frequencia`
  ADD CONSTRAINT `tb_lista_frequencia_ibfk_1` FOREIGN KEY (`id_diario`) REFERENCES `tb_diario` (`id`),
  ADD CONSTRAINT `tb_lista_frequencia_ibfk_2` FOREIGN KEY (`codigo_ra`) REFERENCES `tb_alunos` (`ra`),
  ADD CONSTRAINT `tb_lista_frequencia_ibfk_3` FOREIGN KEY (`codigo_rp`) REFERENCES `tb_professores` (`rp`),
  ADD CONSTRAINT `tb_lista_frequencia_ibfk_4` FOREIGN KEY (`codigo_disciplina`) REFERENCES `tb_disciplinas` (`codigo`);

--
-- Restrições para tabelas `tb_professores`
--
ALTER TABLE `tb_professores`
  ADD CONSTRAINT `tb_professores_ibfk_1` FOREIGN KEY (`rp`) REFERENCES `tb_usuarios` (`rp`);

--
-- Restrições para tabelas `tb_professores_disciplinas`
--
ALTER TABLE `tb_professores_disciplinas`
  ADD CONSTRAINT `tb_professores_disciplinas_ibfk_1` FOREIGN KEY (`codigo_rp`) REFERENCES `tb_professores` (`rp`),
  ADD CONSTRAINT `tb_professores_disciplinas_ibfk_2` FOREIGN KEY (`codigo_disciplina`) REFERENCES `tb_disciplinas` (`codigo`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
